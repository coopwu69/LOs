# สไตล์ไกด์ — แบบประเมิน LOs รายวิชาสหกิจศึกษา

ไฟล์อ้างอิงสไตล์หลักของ UI ที่ใช้ใน `index.html` ให้ทุกหน้าจอ/คอมโพเนนท์ใหม่ทำตามชุดสไตล์นี้เพื่อความสม่ำเสมอ

---

## 1. หลักการดีไซน์

- เรียบง่าย อ่านง่าย ไม่แยกสายตาจากเนื้อหา
- เน้นโทนสีน้ำเงินเข้มเป็น `primary` ให้ความรู้สึกทางการ/มหาวิทยาลัย
- พื้นหลังสว่าง ตัวอักษรเข้ม ระยะห่างกว้างสบายตา
- ใช้เงาและรัศมีเล็กน้อยเพื่อแบ่งชั้น (elevation) โดยไม่ฟุ้งเฟ้อ
- ทุกปุ่มที่ใช้เมาส์ต้องมี hover state

---

## 2. Design Tokens

### สี (Colors)

| Token | ค่า | ใช้เมื่อ |
|---|---|---|
| `--primary` | `#1e40af` | ปุ่มหลัก, ลิงก์, ไอคอน, หัวข้อหลัก |
| `--primary-light` | `#3b82f6` | hover border, focus outline, ไอคอนพื้นหลัง |
| `--primary-dark` | `#1e3a8a` | หัวข้อย่อย, gradient ด้านบน |
| `--bg` | `#f8fafc` | พื้นหลังหน้า |
| `--surface` | `#ffffff` | การ์ด, กล่องเนื้อหา |
| `--surface-2` | `#f1f5f9` | พื้นหลังย่อย, badge, domain title |
| `--text` | `#0f172a` | ข้อความหลัก |
| `--text-secondary` | `#475569` | คำอธิบาย, meta |
| `--text-muted` | `#94a3b8` | placeholder, ข้อความจาง |
| `--border` | `#e2e8f0` | ขอบมาตรฐาน |
| `--border-strong` | `#cbd5e1` | ขอบ input เริ่มต้น |
| `--success` | `#16a34a` | สถานะสำเร็จ |
| `--warning` | `#d97706` | เตือน |
| `--error` | `#dc2626` | ข้อผิดพลาด |

### แบบอักษร (Typography)

| องค์ประกอบ | ขนาด | น้ำหนัก | อื่น ๆ |
|---|---|---|---|
| H1 หน้า | `1.5rem` | 700 | สีขาว บน gradient header |
| คำบรรยายใต้ H1 | `0.9rem` | 400 | ขาว opacity 0.85 |
| Page title | `1.35rem` | 700 | `--text` |
| Page desc | `0.95rem` | 400 | `--text-secondary` |
| Card title | `1.05rem` | 600 | `--text` |
| Card meta | `0.82rem` | 500 | `--text-muted` |
| Badge | `0.78rem` | 500 | `--text-secondary`, bg `--surface-2` |
| เนื้อหาเอกสาร | `1rem` | 400 | line-height 1.65 (Thai) |
| Section title | `1.15rem` | 700 | `--primary-dark` |
| Domain title | `1.02rem` | 600 | `--primary` |

**ฟอนต์หลัก (index.html):** `"Sarabun", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`

**ฟอนต์หลักของระบบ Next.js (`web/`):** `IBM Plex Sans Thai Looped` (Google Fonts) — subset `thai,latin`, weights `300,400,500,600,700`

### ระยะห่าง (Spacing)

| Token/ค่า | การใช้ |
|---|---|
| `32px 24px` | padding `.container` บนหน้าจอใหญ่ |
| `20px 14px` | padding `.container` บนมือถือ |
| `22px` | padding ใน `.card` |
| `24px` | padding `.eval-header`, `.eval-body` |
| `16px` | gap ของ grid, ระยะห่างระหว่างการ์ด |
| `14px` | ระยะห่าง breadcrumb |

### รัศมีมุม (Border Radius)

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--radius` | `12px` | card, eval-header, eval-body, input |
| `--radius-sm` | `8px` | badge, back-btn, print-btn, lo-code, domain-title |
| `20px` | `20px` | breadcrumb button, badge บางประเภท |
| `10px` | `10px` | `.card-icon` |
| `6px` | `6px` | `.lo-code`, `.rubric-level` |

### เงา (Shadows)

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(15,23,42,.06)` | card ปกติ |
| `--shadow` | `0 4px 12px rgba(15,23,42,.08)` | header, การ์ด hover |
| `--shadow-lg` | `0 12px 32px rgba(15,23,42,.12)` | card hover (ยกขึ้น) |

---

## 3. คอมโพเนนท์หลัก

### Header (`.app-header`)

- `background: linear-gradient(135deg, var(--primary-dark), var(--primary));`
- สีขาวทั้งหมด
- `padding: 28px 24px`
- ติดบนสุด (`position: sticky; top: 0;`)
- มี `breadcrumb` สีขาวโปร่งใส (`background: rgba(255,255,255,.15)`)

### Card (`.card`)

- พื้นหลังขาว, border `--border`, มุม `12px`
- มี `.card-icon` สี่เหลี่ยม `44×44px` พื้นหลัง gradient ฟ้าอ่อน
- มี `.card-title` และ `.card-meta` + `.badge`
- `hover`: ขยับขึ้น `translateY(-2px)`, เปลี่ยน border เป็น `--primary-light`, เงา `--shadow-lg`
- `focus-visible`: `outline: 3px solid var(--primary-light)`

### Search Bar (`.search-bar input`)

- กว้างเต็ม, padding `12px 16px`
- border `--border-strong`, radius `12px`
- focus: border `--primary` + shadow `0 0 0 3px rgba(59,130,246,.25)`

### Evaluation Form (`.eval-header` / `.eval-body`)

- กล่องขาว, border, radius `12px`, shadow บาง ๆ
- `.section-title`: มีเส้นใต้สี `--primary-light`
- `.domain-title`: bg `--surface-2`, ขอบซ้าย `--primary`
- `.lo-item`: bg `--surface-2`, ขอบซ้าย `--primary-light`
- `.lo-code`: ตัวหนา, สี `--primary`, bg ขาว, border

### Buttons

| ปุ่ม | สไตล์ |
|---|---|
| `.print-btn` | bg `--primary`, ขาว, ไม่มี border, hover เป็น `--primary-dark` |
| `.back-btn` | bg ขาว, border `--border-strong`, ตัวอักษร `--text-secondary`, hover เปลี่ยนเป็น `--primary` |

---

## 4. Responsive

- มือถือ `< 640px`:
  - `.container` padding `20px 14px`
  - `.grid` เป็น 1 คอลัมน์
  - `.eval-body` padding `18px`
- แท็บเล็ต/เดสก์ท็อป:
  - `.grid` ใช้ `auto-fill` ขั้นต่ำ `280px`

---

## 5. หมายเหตุสำหรับการพัฒนาต่อ

- ห้าม hardcode สีหรือขนาดที่ไม่อยู่ในตาราง token ข้างต้น
- หากนำไปใช้กับ Tailwind หรือ CSS framework อื่น ให้ map token นี้เป็น CSS variables หรือ theme ตรง ๆ
- รักษาโทนสีน้ำเงินเข้ม/ฟ้าอ่อนและพื้นหลังสีขาว-เทาอ่อนเหมือนเดิม
- ฟอนต์หลักของ `web/` คือ `IBM Plex Sans Thai Looped` (subset `thai,latin`, weights 300–700)
- ข้อความภาษาไทยใช้ `line-height: 1.6–1.75` และเปิด `overflow-wrap: break-word` เพื่อรองรับคำยาว

---

## 6. StepProgressBar — ตัวบอกขั้นตอนแบบ progress bar

> ใช้ใน EvaluationWizard (`web/src/components/evaluation/StepProgressBar.tsx`)
> แทน Stepper แบบเดิมที่ใช้เส้นเชื่อมระหว่างวงกลมเป็นสีเขียว

### โครงสร้าง

แบ่งเป็น 2 แถวแยกกัน:

```
┌──────────────────────────────────────────────────────────────┐
│  ①      ②      ③      ④      ⑤      ⑥    ← แถววงกลม + label │
│ ส่วน 1  ส่วน 2  ส่วน 3  ส่วน 4  ส่วน 5  ส่วน 6                │
├──────────────────────────────────────────────────────────────┤
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  ← แถว track bar       │
└──────────────────────────────────────────────────────────────┘
```

- **แถวบน:** วงกลม (number/check icon) + label แต่ละส่วน วางใน grid เท่ากัน (`grid-cols-N`)
- **แถวล่าง:** progress track เส้นเดียวยาวเต็มความกว้าง แยกจากวงกลม (ไม่ใช่เส้นเชื่อมระหว่างวงกลม)

### พฤติกรรมสี (ใช้ design tokens)

| สถานะ | วงกลม | ตัวอย่างเมื่ออยู่ส่วน 3/6 |
|---|---|---|
| completed (index < current) | `border-action bg-action text-inverse` + เครื่องหมาย ✓ | วงกลม 1, 2 เป็นสีน้ำเงิน indigo พร้อม check icon |
| active (index === current) | `border-action bg-action text-inverse` + เลข | วงกลม 3 เป็นสีน้ำเงิน indigo แสดงเลข 3 |
| upcoming (index > current) | `border-border-default bg-sunken text-tertiary` + เลข | วงกลม 4, 5, 6 เป็นสีเทา |

- **Track bar ล่าง:** พื้นหลัง `bg-sunken` ตลอดทั้งแถบ, ส่วนที่เติม `bg-action` ความกว้าง `((currentStep + 1) / total) × 100%`
- เมื่ออยู่ส่วน 3 ของ 6 → bar เติม 50% ครอบคลุมตำแหน่งส่วน 1 ถึง 3
- Animation: `transition-all duration-300 ease-out`

### คำศัพท์

ใช้คำว่า **"ส่วน"** (th) / **"Section"** (en) แทน "ขั้น" / "Step" ทั่วทั้ง wizard:
- `copy.step` = "ส่วน" / "Section"
- `copy.stepsLabel` = "ส่วนของแบบประเมิน" / "Evaluation sections"
- `copy.firstStep` = "กลับไปดูส่วนแรก" / "Return to first section"
- แสดงผล: "ส่วน 3 จาก 6"

### Navigation policy

ตามกฎใน `web/CLAUDE.md` — ห้ามบล็อกการเปลี่ยนหน้าด้วย validation:
- `allowUnrestrictedNavigation` อนุญาตให้คลิกส่วนใดก็ได้โดยอิสระ
- `stepCompletion` ใช้แค่เป็น soft indicator (checkmark ใน `aria-label`) ไม่ใช่ตัวบล็อก
- validation ทำที่ `handleSubmit` ตอนส่งจริงเท่านั้น

### Props

```ts
interface StepProgressBarProps {
  currentStep: number;                    // 0-indexed
  stepCompletion: boolean[];              // soft checkmarks (non-blocking)
  onSelect: (step: number) => void;
  locale: Locale;
  allowUnrestrictedNavigation?: boolean;  // default false
}
```

### Accessibility

- `<nav aria-label={copy.stepsLabel}>` ครอบทั้ง component
- ปุ่มแต่ละส่วนมี `aria-current="step"` เมื่อเป็นส่วนปัจจุบัน
- `aria-label` ระบุชื่อส่วนและสถานะ complete เช่น "ส่วน 3: จริยธรรมและบุคลิก"
- Track bar มี `role="progressbar"` พร้อม `aria-valuenow/min/max`
- Focus ring ใช้ `--shadow-focus-ring` (3:1 contrast)
