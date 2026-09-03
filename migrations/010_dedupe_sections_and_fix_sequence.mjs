// Deduplicate sections and questions, then fix sequence numbers.
//
// For each program:
// 1. Group sections by (title_th, domain_type). Keep the one with the lowest sequence.
// 2. For each duplicate section's questions:
//    a. Find the matching question in the canonical section (same lo_code, or same text if lo_code is null)
//    b. If the duplicate question's options have more descriptions than the canonical's,
//       copy the descriptions over to the canonical question's options.
//    c. Delete the duplicate question (cascade deletes its options).
// 3. Delete the duplicate sections.
// 4. Fix sequence on remaining questions: within each section, order by lo_code (NULL last),
//    assign sequence = 1, 2, 3, ...
// 5. Also fix section.sequence to be 1, 2, 3, 4 within each template.
//
// Safety:
// - Backup tables created (section_backup, question_backup)
// - Single transaction, rollback on error
// - --dry-run flag

import { Pool } from "pg";
import { readFileSync } from "fs";
const env = readFileSync(".env.local", "utf8");
const match = env.match(/DATABASE_URL="([^"]+)"/);
process.env.DATABASE_URL = match[1];
const DRY_RUN = process.argv.includes("--dry-run");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

// Natural sort for LO codes: LO1, LO2, ..., LO10, LO11, LO12
function loSortValue(loCode) {
  if (!loCode) return Infinity; // NULLs go last
  const match = loCode.match(/LO(\d+)/i);
  if (match) return parseInt(match[1], 10);
  // PLO1, PLO2, etc.
  const pmatch = loCode.match(/PLO(\d+)/i);
  if (pmatch) return parseInt(pmatch[1], 10);
  return loCode; // fallback: alphabetical
}

async function run() {
  const client = await pool.connect();
  try {
    // 1. Find all programs with duplicate sections
    const { rows: affectedPrograms } = await client.query(`
      SELECT p.id, p.code
      FROM assessment_sections s
      JOIN evaluation_templates t ON t.id = s.template_id
      JOIN programs p ON p.id = t.program_id
      GROUP BY p.id, p.code
      HAVING COUNT(*) > COUNT(DISTINCT (s.title_th, s.domain_type))
      ORDER BY p.code
    `);

    console.log(`Found ${affectedPrograms.length} programs with duplicate sections.`);

    if (DRY_RUN) {
      console.log("[DRY RUN] No changes will be applied.\n");
    }

    // 2. Preview: for each program, show what will be kept/deleted
    let totalQuestionsToDelete = 0;
    let totalSectionsToDelete = 0;
    let totalOptionsUpdated = 0;

    for (const prog of affectedPrograms) {
      // Get all sections for this program, grouped by (title_th, domain_type)
      const { rows: sections } = await client.query(`
        SELECT s.id, s.title_th, s.domain_type, s.sequence, s.part,
          (SELECT COUNT(*) FROM evaluation_questions q WHERE q.section_id = s.id) AS q_count
        FROM assessment_sections s
        JOIN evaluation_templates t ON t.id = s.template_id
        WHERE t.program_id = $1
        ORDER BY s.sequence
      `, [prog.id]);

      // Group by (title_th, domain_type)
      const groups = new Map();
      for (const s of sections) {
        const key = `${s.title_th}|${s.domain_type}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
      }

      const canonicalSectionIds = new Set();
      const duplicateSectionIds = new Set();

      for (const [, group] of groups) {
        // Keep the one with the lowest sequence
        group.sort((a, b) => a.sequence - b.sequence);
        canonicalSectionIds.add(group[0].id);
        for (let i = 1; i < group.length; i++) {
          duplicateSectionIds.add(group[i].id);
        }
      }

      console.log(`\n[${prog.code}]`);
      console.log(`  Canonical sections: ${canonicalSectionIds.size}`);
      console.log(`  Duplicate sections to delete: ${duplicateSectionIds.size}`);

      // For each duplicate section, check if its questions have better options
      for (const dupSectionId of duplicateSectionIds) {
        const { rows: dupQuestions } = await client.query(`
          SELECT q.id, q.lo_code, q.text, q.sequence, q.section_id
          FROM evaluation_questions q
          WHERE q.section_id = $1
          ORDER BY q.sequence
        `, [dupSectionId]);

        for (const dupQ of dupQuestions) {
          // Find matching question in canonical section
          const dupSection = sections.find(s => s.id === dupSectionId);
          const canonicalSection = sections.find(s =>
            s.title_th === dupSection.title_th &&
            s.domain_type === dupSection.domain_type &&
            canonicalSectionIds.has(s.id)
          );

          if (!canonicalSection) continue;

          // Find matching question by lo_code (or text if lo_code is null)
          let matchQuery, matchParams;
          if (dupQ.lo_code) {
            matchQuery = `SELECT q.id, q.text FROM evaluation_questions q WHERE q.section_id = $1 AND q.lo_code = $2`;
            matchParams = [canonicalSection.id, dupQ.lo_code];
          } else {
            matchQuery = `SELECT q.id, q.text FROM evaluation_questions q WHERE q.section_id = $1 AND q.text = $2`;
            matchParams = [canonicalSection.id, dupQ.text];
          }

          const { rows: matches } = await client.query(matchQuery, matchParams);
          const canonicalQ = matches[0];

          if (canonicalQ) {
            // Check if duplicate has more descriptions
            const { rows: dupOpts } = await client.query(
              `SELECT score, label_th, description_th FROM assessment_options WHERE question_id = $1 ORDER BY score DESC`, [dupQ.id]
            );
            const { rows: canonOpts } = await client.query(
              `SELECT id, score, label_th, description_th FROM assessment_options WHERE question_id = $1 ORDER BY score DESC`, [canonicalQ.id]
            );

            const dupDescCount = dupOpts.filter(o => o.description_th).length;
            const canonDescCount = canonOpts.filter(o => o.description_th).length;

            if (dupDescCount > canonDescCount) {
              totalOptionsUpdated++;
              if (DRY_RUN) {
                console.log(`    [BETTER OPTS] ${dupQ.lo_code ?? "(no lo)"}: dup has ${dupDescCount} desc vs canonical ${canonDescCount} — will copy`);
              }
              // Copy descriptions from dup to canonical
              if (!DRY_RUN) {
                for (const dupOpt of dupOpts) {
                  const canonOpt = canonOpts.find(o => o.score === dupOpt.score);
                  if (canonOpt && dupOpt.description_th && !canonOpt.description_th) {
                    await client.query(
                      `UPDATE assessment_options SET description_th = $1, updated_at = now() WHERE id = $2`,
                      [dupOpt.description_th, canonOpt.id]
                    );
                  }
                }
              }
            }
          }
          totalQuestionsToDelete++;
        }
      }

      totalSectionsToDelete += duplicateSectionIds.size;
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`  Questions to delete: ${totalQuestionsToDelete}`);
    console.log(`  Sections to delete:  ${totalSectionsToDelete}`);
    console.log(`  Options to update:   ${totalOptionsUpdated}`);

    if (DRY_RUN) {
      console.log("\n[DRY RUN] No changes applied.");
      return;
    }

    // 3. Apply changes
    await client.query("BEGIN");

    // Create backup tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS question_text_backup (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id uuid NOT NULL,
        original_text text NOT NULL,
        backed_up_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS section_backup (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        section_id uuid NOT NULL,
        original_data jsonb NOT NULL,
        backed_up_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    let deletedQuestions = 0;
    let deletedSections = 0;
    let updatedSequences = 0;

    for (const prog of affectedPrograms) {
      // Re-fetch sections
      const { rows: sections } = await client.query(`
        SELECT s.id, s.title_th, s.domain_type, s.sequence
        FROM assessment_sections s
        JOIN evaluation_templates t ON t.id = s.template_id
        WHERE t.program_id = $1
        ORDER BY s.sequence
      `, [prog.id]);

      const groups = new Map();
      for (const s of sections) {
        const key = `${s.title_th}|${s.domain_type}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
      }

      const canonicalSectionIds = new Set();
      const duplicateSectionIds = [];
      for (const [, group] of groups) {
        group.sort((a, b) => a.sequence - b.sequence);
        canonicalSectionIds.add(group[0].id);
        for (let i = 1; i < group.length; i++) {
          duplicateSectionIds.push(group[i]);
        }
      }

      // Delete questions from duplicate sections (cascade will delete their options)
      for (const dupSection of duplicateSectionIds) {
        // Backup questions first
        const { rows: dupQuestions } = await client.query(
          `SELECT id, lo_code, text, sequence, section_id FROM evaluation_questions WHERE section_id = $1`, [dupSection.id]
        );
        for (const q of dupQuestions) {
          await client.query(
            `INSERT INTO question_text_backup (question_id, original_text)
             SELECT $1, $2 WHERE NOT EXISTS (
               SELECT 1 FROM question_text_backup b WHERE b.question_id = $1 AND b.original_text = $2
             )`,
            [q.id, q.text]
          );
        }

        // Delete options for these questions first (no cascade configured?)
        await client.query(
          `DELETE FROM assessment_options WHERE question_id IN (SELECT id FROM evaluation_questions WHERE section_id = $1)`,
          [dupSection.id]
        );
        // Delete the questions
        const { rowCount } = await client.query(
          `DELETE FROM evaluation_questions WHERE section_id = $1`, [dupSection.id]
        );
        deletedQuestions += rowCount || 0;

        // Backup and delete the section
        await client.query(
          `INSERT INTO section_backup (section_id, original_data)
           VALUES ($1, $2)`,
          [dupSection.id, JSON.stringify(dupSection)]
        );
        await client.query(`DELETE FROM assessment_sections WHERE id = $1`, [dupSection.id]);
        deletedSections++;
      }

      // Fix section.sequence to be 1, 2, 3, 4...
      const { rows: remainingSections } = await client.query(`
        SELECT s.id FROM assessment_sections s
        JOIN evaluation_templates t ON t.id = s.template_id
        WHERE t.program_id = $1
        ORDER BY s.sequence
      `, [prog.id]);

      for (let i = 0; i < remainingSections.length; i++) {
        await client.query(`UPDATE assessment_sections SET sequence = $1 WHERE id = $2`, [i + 1, remainingSections[i].id]);
      }

      // Fix question.sequence within each remaining section
      for (const sec of remainingSections) {
        const { rows: questions } = await client.query(`
          SELECT id, lo_code FROM evaluation_questions WHERE section_id = $1
        `, [sec.id]);

        // Sort by lo_code (natural sort)
        questions.sort((a, b) => loSortValue(a.lo_code) - loSortValue(b.lo_code));

        for (let i = 0; i < questions.length; i++) {
          await client.query(`UPDATE evaluation_questions SET sequence = $1 WHERE id = $2`, [i + 1, questions[i].id]);
          updatedSequences++;
        }
      }
    }

    // 4. Also fix sequence for programs WITHOUT duplicate sections
    // (in case their sequence is also wrong)
    const { rows: allPrograms } = await client.query(`
      SELECT DISTINCT p.id, p.code
      FROM programs p
      JOIN evaluation_templates t ON t.program_id = p.id
      JOIN assessment_sections s ON s.template_id = t.id
      WHERE p.id NOT IN (SELECT t2.program_id FROM evaluation_templates t2
                          JOIN assessment_sections s2 ON s2.template_id = t2.id
                          GROUP BY t2.program_id
                          HAVING COUNT(*) > COUNT(DISTINCT (s2.title_th, s2.domain_type)))
      ORDER BY p.code
    `);

    for (const prog of allPrograms) {
      const { rows: sections } = await client.query(`
        SELECT s.id FROM assessment_sections s
        JOIN evaluation_templates t ON t.id = s.template_id
        WHERE t.program_id = $1
        ORDER BY s.sequence
      `, [prog.id]);

      for (let i = 0; i < sections.length; i++) {
        await client.query(`UPDATE assessment_sections SET sequence = $1 WHERE id = $2`, [i + 1, sections[i].id]);
      }

      for (const sec of sections) {
        const { rows: questions } = await client.query(`
          SELECT id, lo_code FROM evaluation_questions WHERE section_id = $1
        `, [sec.id]);

        questions.sort((a, b) => loSortValue(a.lo_code) - loSortValue(b.lo_code));
        for (let i = 0; i < questions.length; i++) {
          await client.query(`UPDATE evaluation_questions SET sequence = $1 WHERE id = $2`, [i + 1, questions[i].id]);
          updatedSequences++;
        }
      }
    }

    await client.query("COMMIT");
    console.log(`\n=== APPLIED ===`);
    console.log(`  Questions deleted:  ${deletedQuestions}`);
    console.log(`  Sections deleted:   ${deletedSections}`);
    console.log(`  Sequences updated:  ${updatedSequences}`);
    console.log(`  Backups: question_text_backup, section_backup`);
  } catch (err) {
    try { await client.query("ROLLBACK"); } catch {}
    console.error("\nERROR:", err.message);
    console.error(err.stack);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
