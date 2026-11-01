// Captures tutorial screens from the LOCAL replica (never the live site) and
// records the box of every UI element the video zooms to or clicks.
// Output: public/shots/<name>.png (2x DPR) + src/shots.json (CSS-px boxes, 1920x1080 space).
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const BASE = process.env.REPLICA_URL ?? "http://127.0.0.1:3100";
const OUT = new URL("../public/shots/", import.meta.url);
const JSON_OUT = new URL("../src/shots.json", import.meta.url);
mkdirSync(OUT, { recursive: true });

// Fresh replica state every run: seeded data + the demo typo fixed in scene 4.
execFileSync("python3", [new URL("./seed.py", import.meta.url).pathname, "--typo"], { stdio: ["ignore", "inherit", "ignore"] });

const shots = existsSync(JSON_OUT) ? JSON.parse(readFileSync(JSON_OUT, "utf8")) : {};
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, locale: "th-TH" });

async function prep() {
  await page.addStyleTag({ content: "nextjs-portal{display:none!important} *{caret-color:transparent!important}" });
  await page.waitForTimeout(300);
}

// Wrap a locator to measure the rendered text's bounds instead of the (often full-width) element.
const tight = (locator) => ({ tight: locator });

// Bounds of one substring inside a locator's rendered text.
const word = (locator, text) => ({ word: locator, text });

async function box(target) {
  if (target.word) {
    const b = await target.word.first().evaluate((el, text) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const i = n.textContent.indexOf(text);
        if (i < 0) continue;
        const r = document.createRange();
        r.setStart(n, i);
        r.setEnd(n, i + text.length);
        const rect = r.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }
      return null;
    }, target.text);
    if (!b) throw new Error(`text "${target.text}" not found`);
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  }
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
  typo: word(q1, "ปัณหา"),
  q1Grid: page.locator('[role="radiogroup"]').first(),
  q2: tight(page.getByText("ทักษะในการทำงานด้านโลจิสติกส์").first()),
  next: page.getByRole("button", { name: "ถัดไป" }),
  back: page.getByRole("button", { name: "ย้อนกลับ" }),
});

// ---------- Scene 4: edit + save (writes only to the local replica) ----------
const Q1_ID = "8fe7646b-a5e1-4b6f-b624-2322945a20ca";
const DEMO = { name: "อาจารย์ตัวอย่าง ทดสอบระบบ", email: "demo@example.com", phone: "000-000-0000" };

await page.goto(`${BASE}/mgt/log/company/th`, { waitUntil: "networkidle" });
await prep();
await snap("s4_company", {
  editBtn: page.getByRole("link", { name: "แก้ไข" }),
  toolbar: page.getByRole("navigation", { name: "เครื่องมือแบบประเมิน" }),
});
await page.goto(`${BASE}/programs/log/edit`, { waitUntil: "networkidle" });
await prep();
const statusBar = page.locator("form > div").first();
const section1 = page.locator("details", { hasText: "ด้านความรู้ (Knowledge)" }).first();
await snap("s4_edit", {
  title: tight(page.locator("h1")),
  statusText: tight(page.getByText("การเปลี่ยนแปลงจะยังไม่เผยแพร่จนกว่าจะบันทึก")),
  statusBar,
  section1Summary: section1.locator("summary").first(),
  section1Open: section1.locator("summary").first().getByText("เปิดแก้ไข"),
});
await section1.locator("summary").first().click();
await page.waitForTimeout(300);
const q1Details = section1.locator("details", { hasText: "ข้อที่ 1" }).first();
await q1Details.evaluate((el) => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(300);
await snap("s4_section", {
  section1Summary: section1.locator("summary").first(),
  q1Summary: q1Details.locator("summary").first(),
  q1Edit: q1Details.locator("summary").first().getByText("แก้ไข", { exact: true }),
});
await q1Details.locator("summary").first().click();
await page.waitForTimeout(300);
const textarea = page.locator(`#text-${Q1_ID}`);
await textarea.evaluate((el) => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(300);
const typoText = await textarea.inputValue();
await snap("s4_typo", {
  textarea,
  label: tight(page.locator(`label[for="text-${Q1_ID}"]`)),
  statusBar,
  saveBtn: page.getByRole("button", { name: /บันทึกแล้ว|บันทึกการเปลี่ยนแปลง/ }),
});
await textarea.fill(typoText.replace("ปัณหา", "ปัญหา"));
await page.waitForTimeout(300);
const saveBtn = page.getByRole("button", { name: "บันทึกการเปลี่ยนแปลง" });
await snap("s4_fixed", {
  textarea,
  statusBar,
  statusText: tight(page.getByText("มีการแก้ไขที่ยังไม่บันทึก")),
  saveBtn,
});
await saveBtn.click();
await page.waitForTimeout(400);
const dlg = page.locator("dialog[open]");
const dlgTargets = () => ({
  dialog: dlg,
  title: tight(dlg.getByText("ยืนยันตัวตนก่อนบันทึก")),
  name: dlg.locator("#reviewer_name"),
  email: dlg.locator("#reviewer_email"),
  phone: dlg.locator("#reviewer_phone"),
  check: dlg.locator('input[type="checkbox"]'),
  checkRow: dlg.locator("label", { hasText: "ตรวจสอบชุดคำถาม" }),
  submit: dlg.getByRole("button", { name: "ยืนยันและบันทึก" }),
});
await snap("s4_dialog", dlgTargets());
await dlg.locator("#reviewer_name").fill(DEMO.name);
await dlg.locator("#reviewer_email").fill(DEMO.email);
await dlg.locator("#reviewer_phone").fill(DEMO.phone);
await dlg.locator('input[type="checkbox"]').check();
await snap("s4_dialog_filled", dlgTargets());
await dlg.getByRole("button", { name: "ยืนยันและบันทึก" }).click();
await page.getByText("บันทึกเรียบร้อยแล้ว").waitFor({ timeout: 20000 });
await page.waitForTimeout(400);
await snap("s4_saved", { statusBar, statusText: tight(page.getByText("บันทึกเรียบร้อยแล้ว")), textarea });

// Re-open the form to show the corrected wording.
await page.goto(`${BASE}/mgt/log/company/th`, { waitUntil: "networkidle" });
await prep();
await page.getByRole("button", { name: /ส่วน 3/ }).click();
await page.waitForTimeout(900);
const q1Fixed = page.getByText("การประยุกต์ใช้ความรู้ด้านการจัดการโลจิสติกส์", { exact: false }).first();
await snap("s4_verify", { q1: tight(q1Fixed), fixedWord: word(q1Fixed, "ปัญหา") });

// ---------- Scene 5: Word download ----------
await page.goto(`${BASE}/programs/log/review`, { waitUntil: "networkidle" });
await prep();
const row0 = page.locator("table tbody tr").first();
await snap("s5_review", {
  download0: row0.getByRole("link", { name: "ดาวน์โหลด" }),
  row0,
  confirm0: row0.getByRole("button", { name: "ยืนยันว่าตรวจสอบแล้ว" }),
  status0: row0.locator("td").nth(1).locator("span").first(),
});
const res = await page.request.get(`${BASE}/programs/log/review/export/company`);
const disposition = res.headers()["content-disposition"] ?? "";
const docxName = decodeURIComponent(disposition.split("''")[1] ?? "Company_LOG.docx");
const docxPath = `/tmp/${docxName}`;
writeFileSync(docxPath, await res.body());
const pdfPath = docxPath.replace(/\.docx$/, ".pdf");
// Needs libreoffice-writer + TH Sarabun New installed (see README) so the page matches Word.
execFileSync("soffice", ["-env:UserInstallation=file:///tmp/lo_profile", "--headless", "--convert-to", "pdf", "--outdir", "/tmp", docxPath], { stdio: "ignore" });
execFileSync("python3", ["-c", `
import pymupdf
d = pymupdf.open("${pdfPath}")
lo = next(i for i, p in enumerate(d) if "การประยุกต์ใช้ความรู้" in p.get_text())
d[0].get_pixmap(dpi=160).save("${new URL("docx_page1.png", OUT).pathname}")
d[lo].get_pixmap(dpi=160).save("${new URL("docx_page_lo.png", OUT).pathname}")
`]);
shots.docx = { file: "shots/docx_page1.png", boxes: {}, filename: docxName };
shots.docx_lo = { file: "shots/docx_page_lo.png", boxes: {} };
console.log("captured docx", docxName);

// ---------- Scene 6: confirm review ----------
await row0.getByRole("button", { name: "ยืนยันว่าตรวจสอบแล้ว" }).click();
await page.waitForTimeout(500);
const cdlg = page.locator("dialog[open]");
const cTargets = () => ({
  dialog: cdlg,
  title: tight(cdlg.getByRole("heading", { name: "ยืนยันการตรวจสอบ" })),
  info: cdlg.locator("div.bg-sunken").first(),
  name: cdlg.locator("#review_reviewer_name"),
  email: cdlg.locator("#review_reviewer_email"),
  phone: cdlg.locator("#review_reviewer_phone"),
  checkRow: cdlg.locator("label", { hasText: "ฉันได้ตรวจสอบเนื้อหาแบบประเมินนี้แล้ว" }),
  submit: cdlg.getByRole("button", { name: "ยืนยันการตรวจสอบ" }),
  cancel: cdlg.getByRole("button", { name: "ยกเลิก" }),
});
await snap("s6_dialog", cTargets());
await cdlg.locator("#review_reviewer_name").fill(DEMO.name);
await snap("s6_f1", cTargets());
await cdlg.locator("#review_reviewer_email").fill(DEMO.email);
await snap("s6_f2", cTargets());
await cdlg.locator("#review_reviewer_phone").fill(DEMO.phone);
await snap("s6_f3", cTargets());
await cdlg.locator('input[type="checkbox"]').check();
await snap("s6_f4", cTargets());
await cdlg.getByRole("button", { name: "ยืนยันการตรวจสอบ" }).click();
await page.getByText("ตรวจโดย").first().waitFor({ timeout: 20000 });
await page.waitForTimeout(600);
const done = {};
const rows6 = page.locator("table tbody tr");
for (let i = 0; i < 3; i++) {
  done[`row${i}`] = rows6.nth(i);
  done[`status${i}`] = rows6.nth(i).locator("td").nth(1).locator("span").first();
  done[`confirm${i}`] = rows6.nth(i).getByRole("button", { name: /ยืนยันว่าตรวจสอบแล้ว|ตรวจซ้ำ/ });
}
done.reviewedBy = tight(page.getByText("ตรวจโดย").first());
await snap("s6_done", done);

writeFileSync(JSON_OUT, JSON.stringify(shots, null, 1));
await browser.close();
