const { Client } = require("pg");

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const { rows } = await client.query(`
      SELECT id, title_th, domain_type
      FROM assessment_sections
      WHERE title_th LIKE 'Section%'
    `);
    if (rows.length === 0) {
      console.log("No Section titles to fix.");
      return;
    }
    await client.query("BEGIN");
    for (const row of rows) {
      const titleTh = row.domain_type === "general" ? "ด้านทั่วไป" : row.title_th;
      const titleEn = row.domain_type === "general" ? "General" : null;
      await client.query(
        `UPDATE assessment_sections SET title_th = $1, title_en = $2, updated_at = now() WHERE id = $3`,
        [titleTh, titleEn, row.id]
      );
    }
    await client.query("COMMIT");
    console.log(`Fixed ${rows.length} section title(s).`);
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

run();
