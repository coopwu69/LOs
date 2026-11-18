// End-to-end check of the server actions with a FAKE database: no real DB is touched.
// Verifies that the "unable to assess" answer (X) is accepted only where a program
// variant allows it, is left out of score/count, and that other programs reject it.
//
// Run: npm run test:submit
import assert from "node:assert/strict";
import test from "node:test";
import pg from "pg";

process.env.DATABASE_URL = "postgres://fake:fake@localhost:1/fake";

type Call = { sql: string; params: unknown[] };
const calls: Call[] = [];
let programCode = "IMAG";

// Replace the Postgres pool: answer the few queries the actions make, record the INSERT.
const fakeQuery = async (sql: string, params: unknown[] = []) => {
  calls.push({ sql, params });
  if (/SELECT code FROM programs/i.test(sql)) return { rows: [{ code: programCode }] };
  if (/INSERT INTO (evaluation|advisor)_submissions/i.test(sql)) return { rows: [{ id: "00000000-0000-4000-8000-000000000099" }] };
  return { rows: [] };
};
(pg.Pool.prototype as unknown as { query: typeof fakeQuery }).query = fakeQuery;
(pg.Pool.prototype as unknown as { connect: () => Promise<unknown> }).connect = async () => ({ query: fakeQuery, release() {} });

type Actions = {
  submitEvaluation: (prev: unknown, fd: FormData) => Promise<{ success: boolean; fieldErrors?: Record<string, string> }>;
  submitAdvisorEvaluation: (prev: unknown, fd: FormData) => Promise<{ success: boolean; fieldErrors?: Record<string, string> }>;
};
// Loaded lazily so the fake pool above is installed before the actions touch the database module.
async function actions(): Promise<Actions> {
  const company = await import("../src/app/programs/[programId]/actions");
  const advisor = await import("../src/app/[school]/[program]/advisor/actions");
  return { submitEvaluation: company.submitEvaluation as Actions["submitEvaluation"], submitAdvisorEvaluation: advisor.submitAdvisorEvaluation as Actions["submitAdvisorEvaluation"] };
}

const IDS = {
  programId: "11111111-1111-4111-8111-111111111111",
  templateId: "22222222-2222-4222-8222-222222222222",
  draftToken: "",
  locale: "th",
};

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...IDS, ...fields })) fd.set(k, v);
  return fd;
}

const company = {
  evaluator_email: "a@example.com", semester: "1", academic_year: "2569", company: "Acme", evaluator_name: "สมชาย ใจดี",
  position: "Manager", department: "IT", phone: "0812345678", student_code: "64000001", student_name: "สมหญิง ตั้งใจ",
  school: "S", program: "P", strengths: "ดี", improvements: "ดี", hiring_interest: "yes", coop_next_year: "yes",
  next_year_count: "1", "center-0": "3", "center-1": "3", other_comments: "", "skill-1": "1",
  "c-0": "4", "c-1": "3", "c-2": "2", "c-3": "1", "c-4": "4",
};

const lastInsert = () => calls.filter((c) => /INSERT INTO evaluation_submissions/i.test(c.sql)).at(-1);

test("company IMAG: X on item 5 is accepted and excluded from score and count", async () => {
  programCode = "IMAG";
  calls.length = 0;
  const result = await (await actions()).submitEvaluation(null, form({ ...company, "c-4": "X" }));
  assert.equal(result.success, true, JSON.stringify(result));
  // params: [..., c_score, c_count, center_score, center_count] → 4+3+2+1 = 10 over 4 answered items
  const p = lastInsert()!.params;
  assert.equal(p[6], 10, "c_score");
  assert.equal(p[7], 4, "c_count");
  assert.match(String(p[2]), /"c-4":"X"/, "payload keeps X");
});

test("company IMAG: a normal 1–4 answer on item 5 still scores all five", async () => {
  programCode = "IMAG";
  calls.length = 0;
  const result = await (await actions()).submitEvaluation(null, form(company));
  assert.equal(result.success, true, JSON.stringify(result));
  const p = lastInsert()!.params;
  assert.equal(p[6], 14);
  assert.equal(p[7], 5);
});

test("company IMAG: X on any other item is rejected", async () => {
  programCode = "IMAG";
  calls.length = 0;
  const result = await (await actions()).submitEvaluation(null, form({ ...company, "c-3": "X" }));
  assert.equal(result.success, false);
  assert.equal(lastInsert(), undefined, "nothing saved");
});

test("company other program: X is rejected even on item 5", async () => {
  programCode = "ARCH";
  calls.length = 0;
  const result = await (await actions()).submitEvaluation(null, form({ ...company, "c-4": "X" }));
  assert.equal(result.success, false);
  assert.equal(lastInsert(), undefined, "nothing saved");
});

const advisor = {
  evaluator_email: "a@example.com", semester: "1", academic_year: "2569", student_code: "64000001", student_name: "สมหญิง ตั้งใจ",
  company: "Acme", advisor_name: "อาจารย์ ใจดี",
  "adv-report-0": "4", "adv-report-1": "3", "adv-report-2": "2", "adv-report-3": "1", "adv-report-4": "4",
};

// The advisor form has many other required fields; ask the action which ones are missing and
// assert the REPORT fields are never among them (that is the part this change touches).
const reportErrors = (result: { fieldErrors?: Record<string, string> }) =>
  Object.keys(result.fieldErrors ?? {}).filter((k) => k.startsWith("adv-report-"));

test("advisor IMAG: report X on item 5 raises no report error; on item 4 it does", async () => {
  programCode = "IMAG";
  const ok = await (await actions()).submitAdvisorEvaluation(null, form({ ...advisor, "adv-report-4": "X" }));
  assert.deepEqual(reportErrors(ok as never), [], "item 5 X allowed");
  const bad = await (await actions()).submitAdvisorEvaluation(null, form({ ...advisor, "adv-report-3": "X" }));
  assert.deepEqual(reportErrors(bad as never), ["adv-report-3"]);
});

test("advisor other program: report X is rejected", async () => {
  programCode = "ARCH";
  const bad = await (await actions()).submitAdvisorEvaluation(null, form({ ...advisor, "adv-report-4": "X" }));
  assert.deepEqual(reportErrors(bad as never), ["adv-report-4"]);
});
