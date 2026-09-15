// Capture real screenshots for the /help guide + PDF versions of the guide.
//
//   node scripts/capture-help.mjs        → screenshots into public/help/{th,en}/
//   node scripts/capture-help.mjs pdf    → guide PDFs into public/help/
//
// Walks the REAL flow (home → school → review → form → confirm dialog) against
// the running dev server for program `ir` (school `polsci`). For the "reviewed"
// badge shot it performs a REAL confirmation with an obviously-example reviewer
// (สมชาย ใจดี / Somchai Jaidee <somchai.jaidee@example.com>), then deletes that
// row from curriculum_review_confirmations at the end.
//
// Red annotation boxes are injected as DOM overlays before each screenshot —
// the guide's captions refer to them ("กรอบสีแดง", numbers 1–4 on the buttons
// legend shot).

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.HELP_BASE_URL ?? "http://localhost:3000";
const OUT = path.join(ROOT, "public", "help");
const MODE = process.argv[2] ?? "shots";

const VIEWPORT = { width: 1366, height: 860 };
const SCHOOL = "polsci";
const PROGRAM = "ir";
const PROGRAM_CODE = "IR";
const REVIEWER_EMAIL = "somchai.jaidee@example.com";

const L = {
  th: {
    locale: "th",
    home: "/?lang=th",
    school: `/schools/${SCHOOL}?lang=th`,
    review: `/programs/${PROGRAM}/review?lang=th`,
    form: `/${SCHOOL}/${PROGRAM}/company/th`,
    view: "ดู",
    copy: "คัดลอกลิงก์",
    download: "ดาวน์โหลด",
    copied: "คัดลอกแล้ว",
    reviewed: "ตรวจแล้ว",
    reviewer: { name: "สมชาย ใจดี", email: REVIEWER_EMAIL, phone: "0812345678" },
  },
  en: {
    locale: "en",
    home: "/?lang=en",
    school: `/schools/${SCHOOL}?lang=en`,
    review: `/programs/${PROGRAM}/review?lang=en`,
    form: `/${SCHOOL}/${PROGRAM}/company/en`,
    view: "View",
    copy: "Copy link",
    download: "Download",
    copied: "Copied!",
    reviewed: "Reviewed",
    reviewer: { name: "Somchai Jaidee", email: REVIEWER_EMAIL, phone: "0812345678" },
  },
};

const shot = (page, dir, name) => page.screenshot({ path: path.join(dir, name) });

// Red-box (+ optional number tag) overlay drawn over live DOM elements.
// position:fixed + huge spread shadow = "spotlight" on the target.
// Targets are resolved with Playwright selectors (locator.boundingBox gives
// viewport-relative rects matching position:fixed).
async function mark(page, marks) {
  await clearMarks(page);
  const rects = [];
  for (const { selector, label } of marks) {
    const box = await page.locator(selector).first().boundingBox().catch(() => null);
    if (!box) {
      console.warn(`  ⚠ mark target not found: ${selector}`);
      continue;
    }
    rects.push({ box, label });
  }
  if (rects.length === 0) return;
  await page.evaluate((rects) => {
    // A top-layer <dialog> paints above anything appended to <body>, so marks
    // made while a dialog is open must live inside it to stay visible.
    const parent = document.querySelector("dialog[open]") ?? document.body;
    for (const { box: r, label } of rects) {
      const box = document.createElement("div");
      box.className = "help-shot-mark";
      box.style.cssText =
        `position:fixed;left:${r.x - 5}px;top:${r.y - 5}px;` +
        `width:${r.width + 10}px;height:${r.height + 10}px;` +
        "border:3px solid #dc2626;border-radius:10px;" +
        "box-shadow:0 0 0 9999px rgba(10,10,10,.40);" +
        "z-index:2147483000;pointer-events:none;";
      if (label != null) {
        const tag = document.createElement("div");
        tag.textContent = String(label);
        tag.style.cssText =
          "position:absolute;top:-16px;left:-16px;min-width:32px;height:32px;" +
          "padding:0 7px;background:#dc2626;color:#fff;border-radius:9999px;" +
          "display:flex;align-items:center;justify-content:center;" +
          "font:700 16px/1 ui-sans-serif,system-ui,sans-serif;";
        box.appendChild(tag);
      }
      parent.appendChild(box);
    }
  }, rects);
}

const clearMarks = (page) =>
  page.evaluate(() => document.querySelectorAll(".help-shot-mark").forEach((n) => n.remove()));

// The Next.js dev-tools indicator (bottom-left "N") is dev-server chrome —
// remove it so screenshots match what real users see in production.
const hideDevtools = (page) =>
  page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((n) => n.remove()));

// Screenshot clipped to the open <dialog> (plus padding) — clearer for the guide.
async function shotDialog(page, outPath) {
  const box = await page.locator("dialog[open]").boundingBox();
  if (!box) throw new Error("dialog[open] has no bounding box");
  const pad = 14;
  await page.screenshot({
    path: outPath,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: Math.min(box.width + pad * 2, VIEWPORT.width),
      height: Math.min(box.height + pad * 2, VIEWPORT.height),
    },
  });
}

async function captureLocale(page, loc) {
  const dir = path.join(OUT, loc.locale);
  fs.mkdirSync(dir, { recursive: true });
  console.log(`\n=== locale ${loc.locale} → ${dir}`);
  // Start from a clean "not reviewed" state so early shots show yellow badges —
  // the previous locale's example submit must not leak into this locale's shots.
  await cleanup();

  // 1 — home: highlight the school row
  await page.goto(BASE + loc.home, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(`a[href^="/schools/${SCHOOL}"]`);
  await hideDevtools(page);
  const schoolRow = `tr[role="link"]:has(a[href^="/schools/${SCHOOL}"])`;
  await page.locator(schoolRow).first().scrollIntoViewIfNeeded();
  await mark(page, [{ selector: schoolRow, label: 1 }]);
  await shot(page, dir, "step-01-home.png");
  await clearMarks(page);
  console.log("  step-01-home.png");

  // 2 — school page: highlight the program row
  await page.goto(BASE + loc.school, { waitUntil: "domcontentloaded" });
  await hideDevtools(page);
  const programRow = `tr[role="button"]:has(td.font-mono:text-is("${PROGRAM_CODE}"))`;
  await page.waitForSelector(programRow);
  await page.locator(programRow).first().scrollIntoViewIfNeeded();
  await mark(page, [{ selector: programRow, label: 2 }]);
  await shot(page, dir, "step-02-programs.png");
  await clearMarks(page);
  console.log("  step-02-programs.png");

  // 3 — review page overview
  await page.goto(BASE + loc.review, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(`tbody tr button[aria-label="${loc.copy}"]`);
  await hideDevtools(page);
  await shot(page, dir, "step-03-review.png");
  console.log("  step-03-review.png");

  // 4 — the four action buttons of the first form, numbered 1–4
  await mark(page, [
    { selector: `tbody tr:first-child a[aria-label="${loc.view}"]`, label: 1 },
    { selector: `tbody tr:first-child button[aria-label="${loc.copy}"]`, label: 2 },
    { selector: `tbody tr:first-child a[aria-label="${loc.download}"]`, label: 3 },
    { selector: `tbody tr:first-child td:last-child > div > button`, label: 4 },
  ]);
  await shot(page, dir, "step-04-actions.png");
  await clearMarks(page);
  console.log("  step-04-actions.png");

  // 5 — the real form (View), stepper highlighted
  await page.goto(BASE + loc.form, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("main nav[aria-label]");
  await hideDevtools(page);
  // wait for the wizard to finish restoring its draft (real fields rendered)
  await page.waitForSelector("main form input", { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await mark(page, [{ selector: "main nav[aria-label]" }]);
  await shot(page, dir, "step-05-form.png");
  await clearMarks(page);
  console.log("  step-05-form.png");

  // 6 — copy-link button in its "copied" state
  await page.goto(BASE + loc.review, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(`tbody tr:first-child button[aria-label="${loc.copy}"]`);
  await hideDevtools(page);
  await page.click(`tbody tr:first-child button[aria-label="${loc.copy}"]`);
  await page.waitForSelector(`tbody tr:first-child button:has-text("${loc.copied}")`);
  await mark(page, [{ selector: `tbody tr:first-child button[aria-label="${loc.copy}"]` }]);
  await shot(page, dir, "step-06-copied.png");
  await clearMarks(page);
  console.log("  step-06-copied.png");

  // 7 — download button highlighted
  await mark(page, [{ selector: `tbody tr:first-child a[aria-label="${loc.download}"]` }]);
  await shot(page, dir, "step-07-download.png");
  await clearMarks(page);
  console.log("  step-07-download.png");

  // 8 — confirmation dialog (empty)
  await page.click(`tbody tr:first-child td:last-child > div > button`);
  await page.waitForSelector("dialog[open] input[name='reviewer_name']");
  await shotDialog(page, path.join(dir, "step-08-dialog.png"));
  console.log("  step-08-dialog.png");

  // 9 — dialog filled, submit button highlighted
  await page.fill("dialog[open] input[name='reviewer_name']", loc.reviewer.name);
  await page.fill("dialog[open] input[name='reviewer_email']", loc.reviewer.email);
  await page.fill("dialog[open] input[name='reviewer_phone']", loc.reviewer.phone);
  await page.check("dialog[open] input[type='checkbox']");
  await mark(page, [{ selector: "dialog[open] button[type='submit']" }]);
  await shotDialog(page, path.join(dir, "step-09-dialog-filled.png"));
  await clearMarks(page);
  console.log("  step-09-dialog-filled.png");

  // 10 — REAL submit (example reviewer; row deleted at the end), badge flips.
  // Wait for the dialog to close AND the green badge — NOT :text("Reviewed"),
  // which substring-matches the pre-existing "Not reviewed" badge instantly.
  await page.click("dialog[open] button[type='submit']");
  await page.waitForSelector("dialog:not([open])", { state: "attached", timeout: 45000 });
  await page.waitForSelector("tbody tr:first-child td:nth-child(2) span.bg-success-bg", { timeout: 45000 });
  await hideDevtools(page);
  await mark(page, [{ selector: "tbody tr:first-child td:nth-child(2) > div" }]);
  await shot(page, dir, "step-10-reviewed.png");
  await clearMarks(page);
  console.log("  step-10-reviewed.png (submitted example confirmation)");
}

// Delete the example confirmations created during capture so the audit table
// stays clean. Only touches rows with our clearly-fake reviewer email.
async function cleanup() {
  const envFile = path.join(ROOT, ".env.local");
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    const r = await pool.query(
      "DELETE FROM curriculum_review_confirmations WHERE reviewer_email = $1",
      [REVIEWER_EMAIL],
    );
    console.log(`\ncleanup: removed ${r.rowCount} example confirmation(s)`);
  } finally {
    await pool.end();
  }
}

async function shots() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1.5,
    });
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    await captureLocale(page, L.th);
    await captureLocale(page, L.en);
  } finally {
    await browser.close();
  }
  await cleanup();
}

async function pdf() {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    fs.mkdirSync(OUT, { recursive: true });
    for (const loc of ["th", "en"]) {
      const out = path.join(OUT, `guide-${loc}.pdf`);
      console.log(`  ${loc}: loading page…`);
      await page.goto(`${BASE}/help?lang=${loc}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("main img");
      // Images below the fold are loading="lazy" — scroll the full page so
      // they all enter the viewport and actually fetch, otherwise the PDF
      // has blank figures.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      const pending = await page.evaluate(
        () => [...document.images].filter((i) => !i.complete).length,
      );
      if (pending > 0) {
        await page
          .waitForFunction(() => [...document.images].every((i) => i.complete), {
            timeout: 30000,
          })
          .catch(() => console.log(`  ${loc}: ${pending} image(s) still pending — continuing`));
      }
      console.log(`  ${loc}: rendering pdf…`);
      await page.evaluate(() => {
        document.querySelectorAll("details").forEach((d) => (d.open = true));
        window.scrollTo(0, 0);
      });
      await page.pdf({
        path: out,
        format: "A4",
        printBackground: true,
        margin: { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" },
      });
      console.log(`  ${out}`);
    }
  } finally {
    await browser.close();
  }
}

const run = MODE === "pdf" ? pdf : shots;
run().then(
  () => console.log("done"),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
