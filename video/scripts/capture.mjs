// Capture CLEAN screenshots (no red boxes baked in) of the real review flow,
// plus the on-screen rectangle of every element the video points at.
//
//   (in ../web)  npm run dev -- -p 3001
//   (here)       node scripts/capture.mjs
//
// Output: public/shots/*.png (1920×1080) + src/shots.json (rects in CSS px of a
// 1600×900 viewport — the video scales them by 1920/1600).
//
// READ-ONLY against the database: the confirm dialog is filled but NEVER
// submitted. The "ตรวจแล้ว" end state is simulated by editing the DOM locally.

import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.CAPTURE_BASE_URL ?? "https://los-wu.vercel.app";
const OUT = path.join(ROOT, "public", "shots");
const VIEWPORT = { width: 1600, height: 900 };
// Each school receives its own link (/schools/<slug>), so the video starts there.
const SCHOOL = "mgt";
const PROGRAM = "log";
const PROGRAM_CODE = "LOG";

const REVIEWER = { name: "สมชาย ใจดี", email: "somchai.jaidee@example.com", phone: "0812345678" };

const rects = {};

async function rectOf(page, selector) {
  const box = await page.locator(selector).first().boundingBox().catch(() => null);
  if (!box) {
    console.warn(`  ⚠ not found: ${selector}`);
    return null;
  }
  return { x: Math.round(box.x), y: Math.round(box.y), w: Math.round(box.width), h: Math.round(box.height) };
}

async function shot(page, name, targets = {}) {
  await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((n) => n.remove()));
  await page.mouse.move(2, 2); // no stray hover states
  await page.waitForTimeout(250);
  const r = {};
  for (const [key, sel] of Object.entries(targets)) r[key] = await rectOf(page, sel);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  rects[name] = r;
  console.log(`  ${name}.png`, Object.keys(r).join(", "));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1.2 });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  // 1 — school page (the link each school receives): program list
  await page.goto(`${BASE}/schools/${SCHOOL}?lang=th`, { waitUntil: "networkidle" });
  const programRow = `tr[role="button"]:has(td.font-mono:text-is("${PROGRAM_CODE}"))`;
  await page.waitForSelector(programRow);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "programs", {
    title: "h1",
    table: "table",
    programRow,
    submittedBadge: `${programRow} td:nth-child(3) span`,
    formChips: `${programRow} td:nth-child(4)`,
    helpLink: 'a[href*="/help"]',
  });

  // 4 — review page
  const review = `${BASE}/programs/${PROGRAM}/review?lang=th`;
  await page.goto(review, { waitUntil: "networkidle" });
  await page.waitForSelector('tbody tr button[aria-label="คัดลอกลิงก์"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  const row = (n) => `tbody tr:nth-child(${n})`;
  const reviewTargets = {
    title: "h1",
    table: "table",
    row1: row(1),
    row2: row(2),
    row3: row(3),
    formCol: `${row(1)} td:nth-child(1)`,
    status1: `${row(1)} td:nth-child(2) > div`,
    actions1: `${row(1)} td:nth-child(3)`,
    view1: `${row(1)} a[aria-label="ดู"]`,
    copy1: `${row(1)} button[aria-label="คัดลอกลิงก์"]`,
    download1: `${row(1)} a[aria-label="ดาวน์โหลด"]`,
    confirm1: `${row(1)} td:last-child > div > button`,
    helpLink: 'a[href*="/help"]',
  };
  await shot(page, "review", reviewTargets);

  // 5 — copy link → "คัดลอกแล้ว"
  await page.click(`${row(1)} button[aria-label="คัดลอกลิงก์"]`);
  await page.waitForSelector(`${row(1)} button:has-text("คัดลอกแล้ว")`);
  await shot(page, "review-copied", { copy1: `${row(1)} button[aria-label="คัดลอกลิงก์"]` });
  await page.waitForTimeout(1800);

  // 6 — confirm dialog, empty
  await page.click(`${row(1)} td:last-child > div > button`);
  await page.waitForSelector("dialog[open] input[name='reviewer_name']");
  await page.waitForTimeout(400);
  const dlg = {
    dialog: "dialog[open]",
    summary: "dialog[open] h2 ~ *",
    name: "dialog[open] input[name='reviewer_name']",
    email: "dialog[open] input[name='reviewer_email']",
    phone: "dialog[open] input[name='reviewer_phone']",
    check: "dialog[open] label:has(input[type='checkbox'])",
    submit: "dialog[open] button[type='submit']",
    cancel: "dialog[open] button:has-text('ยกเลิก')",
  };
  await shot(page, "dialog", dlg);

  // 7 — dialog filled (NOT submitted)
  await page.fill(dlg.name, REVIEWER.name);
  await page.fill(dlg.email, REVIEWER.email);
  await page.fill(dlg.phone, REVIEWER.phone);
  await page.check("dialog[open] input[type='checkbox']");
  await shot(page, "dialog-filled", dlg);

  // 8 — simulated "reviewed" state (DOM only — nothing is saved)
  await page.goto(review, { waitUntil: "networkidle" });
  await page.waitForSelector('tbody tr button[aria-label="คัดลอกลิงก์"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  const simulate = (rows) =>
    page.evaluate(
      ({ rows, name }) => {
        const now = new Date().toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
        for (const n of rows) {
          const tr = document.querySelector(`tbody tr:nth-child(${n})`);
          const cell = tr.querySelector("td:nth-child(2) > div");
          const badge = cell.querySelector("span");
          badge.className = badge.className
            .replaceAll("warning", "success");
          badge.querySelectorAll("*").forEach((el) => {
            if (typeof el.className === "string") el.className = el.className.replaceAll("warning", "success");
            if (el.getAttribute?.("class")) el.setAttribute("class", el.getAttribute("class").replaceAll("warning", "success"));
          });
          const textNode = [...badge.childNodes].find((c) => c.nodeType === 3 && c.textContent.trim());
          if (textNode) textNode.textContent = "ตรวจแล้ว";
          if (!cell.querySelector(".sim-by")) {
            const by = document.createElement("span");
            by.className = "sim-by text-xs text-tertiary";
            by.textContent = `ตรวจโดย ${name} · ${now} น.`;
            cell.appendChild(by);
          }
          const btn = tr.querySelector("td:last-child > div > button");
          btn.textContent = "ตรวจซ้ำ";
          btn.style.background = "var(--bg-raised, #fff)";
          btn.style.color = "var(--primary, #071c31)";
          btn.style.border = "1px solid var(--border-strong, #d6d3d1)";
        }
      },
      { rows, name: REVIEWER.name },
    );
  await simulate([1]);
  await shot(page, "review-done1", { status1: `${row(1)} td:nth-child(2) > div`, confirm1: `${row(1)} td:last-child > div > button` });
  await simulate([2, 3]);
  await shot(page, "review-doneall", {
    status1: `${row(1)} td:nth-child(2) > div`,
    status2: `${row(2)} td:nth-child(2) > div`,
    status3: `${row(3)} td:nth-child(2) > div`,
    statusCol: "tbody tr td:nth-child(2)",
  });

  // 9 — the real form (View)
  await page.goto(`${BASE}/${SCHOOL}/${PROGRAM}/company/th`, { waitUntil: "networkidle" });
  await page.waitForSelector("main nav[aria-label]");
  await page.waitForSelector("main form input", { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "form", {
    stepper: "main nav[aria-label]",
    toolbar: "main a:has-text('แก้ไข'), main button:has-text('แก้ไข')",
    back: "a[aria-label*='กลับ'], nav[aria-label*='breadcrumb'] a, header a",
  });

  // 9b — jump (via the stepper) to the first section that has rating questions
  const stepBtns = page.locator("main nav[aria-label] :is(button,a)");
  const count = await stepBtns.count();
  let lo = -1;
  for (let i = 2; i < count && lo < 0; i++) {
    await stepBtns.nth(i).click();
    await page.waitForTimeout(900);
    const rated = await page.locator("[role='radiogroup']:visible").count();
    const empty = await page.getByText("ยังไม่มีคำถามในหมวดนี้").isVisible().catch(() => false);
    if (rated > 0 && !empty) lo = i;
  }
  if (lo < 0) throw new Error("no section with rating questions found");
  console.log(`  rating section = ส่วน ${lo + 1}`);
  // re-open the form so the stepper shows only that jump
  await page.goto(`${BASE}/${SCHOOL}/${PROGRAM}/company/th`, { waitUntil: "networkidle" });
  await page.waitForSelector("main nav[aria-label]");
  await stepBtns.nth(lo).click();
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await shot(page, "form-step", {
    step: `main nav[aria-label] :is(button,a) >> nth=${lo}`,
  });
  await page.evaluate(() => window.scrollTo({ top: 560, behavior: "instant" }));
  await page.waitForTimeout(1500);
  await shot(page, "form-lo", {
    radiogroup: "[role='radiogroup']:visible",
    next: "button:has-text('ถัดไป')",
    prev: "button:has-text('ย้อนกลับ')",
  });

  fs.writeFileSync(path.join(ROOT, "src", "shots.json"), JSON.stringify({ viewport: VIEWPORT, base: BASE, loStep: lo + 1, rects }, null, 2));
  console.log("\nwrote src/shots.json");
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
