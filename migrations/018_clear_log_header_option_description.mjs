// One LOG option kept a table header ("ลักษณะบุคคล/สมรรถนะ | ผลการประเมิน") as
// its whole description. There is no real description behind it, so clear it.
//
//   node migrations/018_clear_log_header_option_description.mjs

import { readFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";

const { Pool } = createRequire(new URL("../web/package.json", import.meta.url))("pg");
const env = readFileSync(fileURLToPath(new URL("../web/.env.local", import.meta.url)), "utf8");
process.env.DATABASE_URL = env.match(/^DATABASE_URL="?([^"\r\n]+)"?/m)[1];
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const { rowCount } = await pool.query(
  `UPDATE assessment_options SET description_th = NULL, updated_at = now()
   WHERE BTRIM(COALESCE(description_th, '')) IN ('ลักษณะบุคคล/สมรรถนะ', 'ผลการประเมิน', 'ผลลัพธ์การเรียนรู้ที่คาดหวัง')`
);
console.log(`cleared ${rowCount} header-only option descriptions`);
await pool.end();
