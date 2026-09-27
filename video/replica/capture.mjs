// Captures tutorial screens from the LOCAL replica (never the live site) and
// records the box of every UI element the video zooms to or clicks.
// Output: public/shots/<name>.png (2x DPR) + src/shots.json (CSS-px boxes, 1920x1080 space).
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";

const BASE = process.env.REPLICA_URL ?? "http://127.0.0.1:3100";
const OUT = new URL("../public/shots/", import.meta.url);
const JSON_OUT = new URL("../src/shots.json", import.meta.url);
mkdirSync(OUT, { recursive: true });

const shots = existsSync(JSON_OUT) ? JSON.parse(readFileSync(JSON_OUT, "utf8")) : {};
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, locale: "th-TH" });

async function prep() {
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
  await page.waitForTimeout(300);
}

// Wrap a locator to measure the rendered text's bounds instead of the (often full-width) element.
const tight = (locator) => ({ tight: locator });

async function box(target) {
  if (target.tight) {
    const b = await target.tight.first().evaluate((el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const rect = r.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  }
  const locator = target;
  const b = await locator.first().boundingBox();
  if (!b) throw new Error(`no box for ${locator}`);
  return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
}

async function snap(name, targets = {}, { hover = false } = {}) {
  if (!hover) await page.mouse.move(1919, 1079);
  await page.waitForTimeout(250);
  const boxes = {};
  for (const [key, loc] of Object.entries(targets)) boxes[key] = await box(loc);
  await page.screenshot({ path: new URL(`${name}.png`, OUT).pathname });
  shots[name] = { file: `shots/${name}.png`, boxes };
  console.log("captured", name, Object.keys(boxes).join(","));
}

// ---------- Scene 2: school page ----------
await page.goto(`${BASE}/schools/mgt`, { waitUntil: "networkidle" });
await prep();
const logRow = page.locator('tr[role="button"]', { hasText: "การจัดการโลจิสติกส์" });
const search = page.locator('input[type="search"]');
await snap("s2_school", {
  title: tight(page.locator("h1")),
  count: tight(page.getByText("หลักสูตรในสำนักวิชานี้")),
  hint: tight(page.getByText("คลิกหลักสูตรเพื่อเปิดหน้าตรวจสอบ")),
  search,
  table: page.locator("table").first(),
  logRow,
});
await search.click();
let typed = "";
for (const ch of "LOG") {
  typed += ch;
  await search.fill(typed);
  await snap(`s2_search_${typed.length}`, { search, logRow });
}
await logRow.hover();
await snap("s2_hover", { search, logRow }, { hover: true });

// ---------- Scene 3: review dashboard ----------
await page.goto(`${BASE}/programs/log/review`, { waitUntil: "networkidle" });
await prep();
const rows = page.locator("table tbody tr");
const t = {
  title: tight(page.locator("h1")),
  intro: page.getByText("ตรวจสอบความครบถ้วนของแบบประเมินทั้ง 3 ฟอร์ม"),
  table: page.locator("main table").first(),
};
for (let i = 0; i < 3; i++) {
  const r = rows.nth(i);
  t[`row${i}`] = r;
  t[`name${i}`] = tight(r.locator("td").nth(0));
  t[`status${i}`] = r.locator("td").nth(1).locator("span").first();
  t[`view${i}`] = r.getByRole("link", { name: "ดู" });
  t[`download${i}`] = r.getByRole("link", { name: "ดาวน์โหลด" });
  t[`confirm${i}`] = r.getByRole("button", { name: /ยืนยันว่าตรวจสอบแล้ว|ตรวจซ้ำ/ });
}
await snap("s3_review", t);

// ---------- Scene 3: company form ----------
await page.goto(`${BASE}/mgt/log/company/th`, { waitUntil: "networkidle" });
await prep();
const stepBtn = (n) => page.getByRole("button", { name: new RegExp(`ส่วน ${n}`) });
const stepTargets = {};
for (let n = 1; n <= 6; n++) stepTargets[`step${n}`] = stepBtn(n);
await snap("s3_company", {
  title: tight(page.locator("h1")),
  subtitle: tight(page.getByText("หลักสูตรบริหารธุรกิจบัณฑิต สาขาการจัดการโลจิสติกส์").first()),
  formName: tight(page.getByText("แบบประเมินผลการปฏิบัติสหกิจศึกษาจากสถานประกอบการ").first()),
  toolbar: page.getByRole("navigation", { name: "เครื่องมือแบบประเมิน" }),
  editBtn: page.getByRole("link", { name: "แก้ไข" }),
  next: page.getByRole("button", { name: "ถัดไป" }),
  ...stepTargets,
});
await stepBtn(3).click();
await page.waitForTimeout(900);
const q1 = page.getByText("การประยุกต์ใช้ความรู้ด้านการจัดการโลจิสติกส์", { exact: false }).first();
await snap("s3_step3", {
  sectionTitle: tight(page.getByText("ด้านความรู้ (Knowledge)").first()),
  q1: tight(q1),
  q1Grid: page.locator('[role="radiogroup"]').first(),
  q2: tight(page.getByText("ทักษะในการทำงานด้านโลจิสติกส์").first()),
  next: page.getByRole("button", { name: "ถัดไป" }),
  back: page.getByRole("button", { name: "ย้อนกลับ" }),
});

writeFileSync(JSON_OUT, JSON.stringify(shots, null, 1));
await browser.close();
