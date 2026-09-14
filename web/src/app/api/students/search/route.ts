import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { isFixtureMode } from "@/lib/fixtures";
import { UUID_PATTERN } from "@/lib/evaluation-schema";

export const dynamic = "force-dynamic";

const MAX_RESULTS = 12;
const MAX_QUERY_LENGTH = 100;

// GET /api/students/search?programId=<uuid>&q=<text>
//
// Backs the student_name autocomplete on all 3 evaluation forms
// (company/advisor/student). Matches a substring of the Thai full name —
// Thai has no word-boundary spaces, so a plain ILIKE '%q%' is the useful
// match here — and, as a convenience, a prefix of student_code so pasting
// or typing a code into the name field still surfaces the right student.
// Results are scoped to the program the form is already on, capped at
// MAX_RESULTS, and this is a convenience lookup only: callers treat an
// empty/error response as "keep typing free-text", never as a hard
// validation failure.
export async function GET(request: NextRequest) {
  // Fixture mode has no students table — return an empty list so the
  // autocomplete degrades to a plain text field.
  if (isFixtureMode()) return NextResponse.json([]);

  const programId = request.nextUrl.searchParams.get("programId") ?? "";
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);
  if (!UUID_PATTERN.test(programId) || !q) return NextResponse.json([]);

  // Escape LIKE/ILIKE wildcards so a literal % or _ in the input can't
  // turn into an unintended match-everything pattern.
  const escaped = q.replace(/[\\%_]/g, (m) => `\\${m}`);

  try {
    const { rows } = await getPool().query<{ id: string; student_code: string; full_name: string }>(
      `SELECT id::text, student_code, full_name
       FROM students
       WHERE current_program_id = $1
         AND (
           full_name ILIKE '%' || $2 || '%' ESCAPE '\\'
           OR student_code LIKE $2 || '%' ESCAPE '\\'
         )
       ORDER BY full_name
       LIMIT $3`,
      [programId, escaped, MAX_RESULTS],
    );
    return NextResponse.json(rows);
  } catch {
    // A lookup failure must never break the form — the client treats any
    // non-OK response as "no suggestions" and the field stays free-text.
    return NextResponse.json({ error: "search_failed" }, { status: 500 });
  }
}
