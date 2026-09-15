import type { Locale } from "./i18n";

// ---------------------------------------------------------------------------
// /help — beginner-proof user guide for coop-center staff / academic advisors
// who review and confirm evaluation forms (G12 review dashboard).
//
// Written for a reader who has NEVER used this system. Rules applied:
// - no jargon: say หน้าเว็บ / ลิงก์ / หน้าจอ, never URL/route/endpoint
// - every walkthrough step ships with a real screenshot (public/help/<lang>/)
//   and a caption naming exactly what to click
// - the "no real submissions are stored" fact is stated early and repeated
// ---------------------------------------------------------------------------

export type HelpStep = {
  /** Short imperative step title shown next to the numbered badge. */
  title: string;
  /** Plain-language paragraphs shown under the step title. */
  body: string[];
  /** Screenshot filename inside public/help/<locale>/ (same name per locale). */
  img: string;
  imgAlt: string;
  /** Caption under the screenshot — must say exactly what to click/look at. */
  caption: string;
};

export type HelpFaq = { q: string; a: string[] };

export const HELP_COPY: Record<
  Locale,
  {
    pageTitle: string;
    pageSubtitle: string;
    pdfButton: string;
    pdfNote: string;
    /** Prominent top-of-page notice — the single most important fact. */
    noticeTitle: string;
    noticeBody: string;
    tocTitle: string;
    toc: { id: string; label: string }[];

    whatTitle: string;
    whatBody: string[];
    whatFormsIntro: string;
    whatFormsSuffix: string;
    whoTitle: string;
    whoBody: string[];
    noLoginNote: string;

    part1Title: string;
    part1Intro: string[];
    part1Steps: HelpStep[];

    part2Title: string;
    part2Intro: string[];
    part2Steps: HelpStep[];
    buttonsTitle: string;
    buttonsIntro: string;
    /** Annotated screenshot of the four action buttons (numbered 1–4). */
    buttonsImg: string;
    buttonsImgAlt: string;
    buttonsCaption: string;
    buttons: { name: string; does: string }[];
    checklistTitle: string;
    checklist: string[];

    glossaryTitle: string;
    glossary: { term: string; def: string }[];

    faqTitle: string;
    faq: HelpFaq[];

    staffTitle: string;
    staffBody: string[];

    backHome: string;
  }
> = {
  th: {
    pageTitle: "คู่มือการใช้งานระบบ",
    pageSubtitle:
      "สำหรับผู้ตรวจสอบแบบประเมิน — อธิบายทีละขั้นตอนตั้งแต่เปิดหน้าเว็บครั้งแรกจนถึงกดยืนยันการตรวจสอบ ทำตามได้เลยโดยไม่ต้องเคยใช้ระบบนี้มาก่อน",
    pdfButton: "ดาวน์โหลดฉบับ PDF",
    pdfNote:
      "เนื้อหาเหมือนหน้านี้ทุกประการ — เหมาะสำหรับพิมพ์หรือส่งต่อให้ผู้ที่ไม่สะดวกเปิดเว็บ",
    noticeTitle: "สำคัญ — อ่านก่อนเริ่ม",
    noticeBody:
      "ระบบนี้ไม่ได้เก็บคำตอบจริงของใครเลย หน้าที่ของระบบคือให้ท่าน “ดูตัวอย่าง” แบบประเมินที่จะใช้จริงในอนาคต ตรวจสอบว่าคำถามครบถ้วนและถูกต้อง แล้วกดยืนยันเท่านั้น — ถ้าเผลอพิมพ์หรือติ๊กอะไรไว้ในฟอร์ม ไม่ต้องกังวล ปิดหน้าต่างทิ้งได้เลย ไม่มีข้อมูลใดถูกนำไปใช้จริง",
    tocTitle: "สารบัญ — กดที่หัวข้อเพื่อข้ามไปอ่านส่วนนั้น",
    toc: [
      { id: "what-is", label: "1. ระบบนี้คืออะไร และท่านต้องทำอะไร" },
      { id: "find", label: "2. ภาคที่ 1 — เปิดหาหน้าตรวจสอบของหลักสูตร (ขั้นที่ 1–3)" },
      { id: "review", label: "3. ภาคที่ 2 — ตรวจสอบและยืนยันแบบประเมินทีละฟอร์ม (ขั้นที่ 4–8)" },
      { id: "glossary", label: "4. คำศัพท์ที่ควรรู้" },
      { id: "faq", label: "5. คำถามที่พบบ่อยและการแก้ปัญหา" },
      { id: "staff", label: "6. หมายเหตุสำหรับเจ้าหน้าที่ศูนย์สหกิจฯ" },
    ],

    whatTitle: "1. ระบบนี้คืออะไร และท่านต้องทำอะไร",
    whatBody: [
      "ระบบนี้เก็บ “แบบประเมินและแบบสอบถาม” ของรายวิชาสหกิจศึกษาไว้ทุกหลักสูตรของมหาวิทยาลัยวลัยลักษณ์ หน้าที่ของระบบมีอย่างเดียว คือให้ผู้ที่เกี่ยวข้อง เปิดดูหน้าตาของแบบประเมินล่วงหน้า ตรวจสอบว่าคำถามครบถ้วนและถูกต้อง ก่อนที่แบบจะถูกนำไปใช้จริง",
    ],
    whatFormsIntro: "แต่ละหลักสูตรมีแบบฟอร์ม 3 ฉบับ สำหรับผู้กรอก 3 กลุ่ม:",
    whatFormsSuffix:
      "คำถามชุดหลัก (ผลลัพธ์การเรียนรู้ — LOs) เป็นชุดเดียวกันในทั้ง 3 ฟอร์ม ต่างกันที่ผู้กรอกและคำถามส่วนประกอบ",
    whoTitle: "งานของท่านโดยสรุป",
    whoBody: [
      "1. เปิดหน้าแบบประเมินของหลักสูตรที่ท่านรับผิดชอบ (ภาคที่ 1)",
      "2. กดดูเนื้อหาของฟอร์มทั้ง 3 ฉบับ อ่านว่าคำถามครบ สะกดถูก และตัวเลือกคะแนนครบหรือไม่ (ภาคที่ 2)",
      "3. ถ้าทุกอย่างถูกต้อง → กดปุ่ม “ยืนยันว่าตรวจสอบแล้ว” ของแต่ละฟอร์ม",
      "4. ถ้าเจอข้อผิดพลาด → อย่ากดยืนยันฟอร์มนั้น กด “ดาวน์โหลด” เอาไฟล์ Word ไปแก้หรือใส่หมายเหตุ แล้วส่งไฟล์กลับให้ศูนย์สหกิจศึกษาฯ ทางช่องทางที่ติดต่อกันอยู่ (เช่น อีเมลหรือไลน์) — ระบบนี้ไม่มีช่องให้แก้คำถามบนหน้าเว็บสำหรับผู้ตรวจ",
    ],
    noLoginNote:
      "ระบบนี้ไม่มีล็อกอินและไม่ต้องสมัครสมาชิก — เปิดลิงก์แล้วใช้งานได้ทันที ทั้งบนคอมพิวเตอร์และโทรศัพท์มือถือ",

    part1Title: "2. ภาคที่ 1 — เปิดหาหน้าตรวจสอบของหลักสูตร",
    part1Intro: [
      "ทุกอย่างเริ่มจากหน้าแรกของระบบ ทำตามขั้นที่ 1–3 ตามลำดับ ใช้เวลาไม่ถึงหนึ่งนาที",
    ],
    part1Steps: [
      {
        title: "เปิดหน้าแรกของระบบ แล้วกดที่ชื่อสำนักวิชา",
        body: [
          "เปิดลิงก์ที่ศูนย์สหกิจศึกษาฯ ส่งให้ท่าน จะเห็นหน้าแรกแสดงรายชื่อ “สำนักวิชา” ทั้งหมดเรียงเป็นบรรทัด",
          "มองหาบรรทัดที่เป็นสำนักวิชาของหลักสูตรที่ท่านต้องตรวจ — ถ้ารายชื่อยาว พิมพ์ชื่อสำนักวิชาลงในช่อง “ค้นหาสำนักวิชา…” ด้านบนเพื่อกรองให้เหลือน้อยลง",
          "เมื่อเจอแล้ว ให้กดที่ชื่อสำนักวิชานั้น (กดตรงไหนในบรรทัดก็ได้ — ทั้งบรรทัดกดได้ สังเกตลูกศรสีเทาชี้ขวาตรงปลายบรรทัด)",
        ],
        img: "step-01-home.png",
        imgAlt:
          "หน้าแรกของระบบ แสดงตารางรายชื่อสำนักวิชา มีกรอบสีแดงล้อมรอบบรรทัดสำนักวิชาที่ต้องกด",
        caption:
          "ภาพหน้าแรกของระบบ — กรอบสีแดงหมายเลข 1 คือบรรทัดสำนักวิชาที่ต้องกด (ในตัวอย่างนี้คือสำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์ ของท่านอาจเป็นสำนักวิชาอื่น)",
      },
      {
        title: "กดที่ชื่อหลักสูตรที่ต้องการตรวจ",
        body: [
          "หน้าถัดไปแสดงรายชื่อ “หลักสูตร” ทั้งหมดที่อยู่ในสำนักวิชานั้น พร้อมรหัสหลักสูตร สถานะ และป้ายแสดงว่ามี 3 ฟอร์ม (หน่วยงาน / อาจารย์นิเทศ / นักศึกษา)",
          "ป้าย “ส่งแล้ว” สีเขียวหมายถึงหลักสูตรนี้มีชุดคำถามพร้อมให้ตรวจแล้ว ถ้าขึ้น “ยังไม่ส่ง” สีเหลือง แปลว่าศูนย์สหกิจฯ ยังไม่ได้ใส่ชุดคำถาม — แจ้งเจ้าหน้าที่ก่อนตรวจ",
          "กดที่บรรทัดของหลักสูตรที่ท่านต้องการ (กดตรงไหนในบรรทัดก็ได้เช่นกัน)",
        ],
        img: "step-02-programs.png",
        imgAlt:
          "หน้ารายการหลักสูตรของสำนักวิชา มีกรอบสีแดงล้อมรอบบรรทัดหลักสูตรที่ต้องกด",
        caption:
          "กรอบสีแดงหมายเลข 2 คือบรรทัดหลักสูตรที่ต้องกด — ป้าย “ส่งแล้ว” สีเขียวบอกว่าชุดคำถามพร้อมตรวจแล้ว",
      },
      {
        title: "เจอหน้าตรวจสอบ — ศูนย์กลางของงานท่าน",
        body: [
          "หลังกดหลักสูตร จะเข้าสู่หน้า “ตรวจสอบความครบถ้วนของแบบประเมิน” ของหลักสูตรนั้น หน้านี้มีตาราง 3 บรรทัด = แบบฟอร์ม 3 ฉบับ",
          "คอลัมน์ซ้าย “แบบฟอร์ม” บอกชื่อฟอร์มและใครเป็นผู้กรอก (คำสำคัญจะขีดเส้นใต้ตัวหนาไว้) — คอลัมน์กลาง “สถานะ” บอกว่าฟอร์มนั้นตรวจแล้วหรือยัง — คอลัมน์ขวา “การดำเนินการ” มีปุ่มทั้งหมดที่ท่านต้องใช้",
          "จดจำหน้านี้ไว้ — ทุกงานตรวจสอบของท่านทำจากหน้านี้หน้าเดียว",
        ],
        img: "step-03-review.png",
        imgAlt:
          "หน้าตรวจสอบความครบถ้วนของแบบประเมิน แสดงตาราง 3 บรรทัด แต่ละบรรทัดเป็นฟอร์มหนึ่ง พร้อมป้ายสถานะและปุ่ม",
        caption:
          "หน้าตรวจสอบ — ตาราง 3 บรรทัดคือฟอร์ม 3 ฉบับของหลักสูตร สังเกตป้าย “ยังไม่ตรวจ” สีเหลืองในคอลัมน์สถานะ",
      },
    ],

    part2Title: "3. ภาคที่ 2 — ตรวจสอบและยืนยันแบบประเมินทีละฟอร์ม",
    part2Intro: [
      "ทำขั้นที่ 4–8 กับฟอร์มทีละฉบับจนครบทั้ง 3 ฉบับ ลำดับไหนก่อนก็ได้ ไม่บังคับ — แต่ต้องยืนยันครบทั้งสาม",
      "ในแต่ละบรรทัดฟอร์มจะมีปุ่ม 4 ปุ่ม ดูภาพและตารางอธิบายด้านล่างก่อนแล้วค่อยลงมือ",
    ],
    buttonsTitle: "ปุ่ม 4 ปุ่มของแต่ละฟอร์มทำอะไรบ้าง",
    buttonsIntro: "อ้างอิงหมายเลข 1–4 ในกรอบสีแดงของภาพด้านล่าง:",
    buttonsImg: "step-04-actions.png",
    buttonsImgAlt:
      "คอลัมน์การดำเนินการของฟอร์มแรก มีกรอบสีแดงหมายเลข 1–4 ล้อมรอบปุ่ม ดู คัดลอกลิงก์ ดาวน์โหลด และยืนยันว่าตรวจสอบแล้ว",
    buttonsCaption:
      "ปุ่มทั้ง 4 ของแต่ละฟอร์ม — แถวบนมี 3 ปุ่มเล็ก (1 ดู · 2 คัดลอกลิงก์ · 3 ดาวน์โหลด) และปุ่มสีเข้มเต็มความกว้างด้านล่าง (4 ยืนยันว่าตรวจสอบแล้ว)",
    buttons: [
      {
        name: "ดู",
        does: "เปิดแบบฟอร์มจริงขึ้นมาบนหน้าจอ — เห็นหน้าตาและคำถามทั้งหมดเหมือนที่ผู้กรอกจริงจะเห็น ใช้ปุ่มนี้เพื่ออ่านตรวจเนื้อหา",
      },
      {
        name: "คัดลอกลิงก์",
        does: "จำลิงก์ของฟอร์มฉบับนั้นไว้ในเครื่องของท่าน กดแล้วปุ่มจะเปลี่ยนเป็น “คัดลอกแล้ว” ชั่วครู่ — นำไปวาง (กด Ctrl+V หรือแตะค้างแล้วเลือกวาง) ในอีเมลหรือไลน์เพื่อส่งต่อให้ผู้อื่นเปิดฟอร์มฉบับเดียวกันนี้ได้ทันที",
      },
      {
        name: "ดาวน์โหลด",
        does: "บันทึกแบบฟอร์มฉบับนั้นเป็นไฟล์ Word (.docx) ลงโฟลเดอร์ “ดาวน์โหลด” ของเครื่องท่าน — ใช้เมื่อต้องการอ่านแบบกระดาษ หรือแก้ไขข้อผิดพลาดแล้วส่งกลับให้ศูนย์สหกิจฯ",
      },
      {
        name: "ยืนยันว่าตรวจสอบแล้ว",
        does: "ปุ่มสีเข้มเต็มความกว้าง — กดเมื่อตรวจฟอร์มฉบับนั้นครบและถูกต้องแล้วเท่านั้น จะมีกล่องเด้งขึ้นให้กรอกชื่อ-อีเมล-เบอร์โทรก่อนบันทึกเป็นหลักฐาน",
      },
    ],
    checklistTitle: "ตอนเปิดฟอร์มดู ให้ตรวจอะไรบ้าง",
    checklist: [
      "ชื่อฟอร์มที่หัวหน้า ตรงกับผู้กรอกที่ตั้งใจไว้หรือไม่ (สถานประกอบการ / อาจารย์นิเทศ / นักศึกษา)",
      "คำถามครบทุกข้อตามเอกสารต้นฉบับของหลักสูตรหรือไม่ ไม่มีข้อไหนหายหรือซ้ำ",
      "ถ้อยคำและตัวสะกดถูกต้อง อ่านแล้วเข้าใจ ไม่มีคำผิด",
      "ตัวเลือกคะแนนของแต่ละข้อครบถ้วน และคำอธิบายแต่ละระดับสอดคล้องกับเกณฑ์ของหลักสูตร",
      "ช่องข้อมูลทั่วไป (ชื่อ–สกุล รหัสนักศึกษา หน่วยงาน ฯลฯ) อยู่ครบ",
    ],
    part2Steps: [
      {
        title: "กดปุ่ม “ดู” เพื่อเปิดแบบฟอร์มอ่านเนื้อหา",
        body: [
          "กดปุ่ม “ดู” (ปุ่มซ้ายสุดในแถวปุ่มเล็ก หมายเลข 1 ในภาพด้านบน) แบบฟอร์มจริงจะเปิดขึ้นในหน้าเดิม เห็นหน้าจอเหมือนที่ผู้กรอกจริงจะเห็นทุกอย่าง",
          "แบบฟอร์มแบ่งเป็นหลายส่วน — ด้านบนมีแถบวงกลมหมายเลขส่วนต่าง ๆ กดที่ชื่อส่วนไหนก็ได้เพื่อข้ามไปดูส่วนนั้นทันที หรือกดปุ่ม “ถัดไป / ย้อนกลับ” ที่มุมล่างเพื่อไล่ทีละส่วน",
          "กดข้ามส่วนไปมาได้เสมอ ไม่ต้องกรอกอะไรเลย — พิมพ์หรือติ๊กลองได้เต็มที่เพื่อดูการทำงาน ข้อมูลที่พิมพ์ไม่ถูกนำไปใช้จริง",
          "แถบปุ่ม ดู / แก้ไข / พิมพ์ / ดาวน์โหลดเอกสาร / ประวัติการแก้ไข ด้านบนฟอร์มเป็นเครื่องมือของเจ้าหน้าที่ ไม่ต้องกด — ตรวจเสร็จให้กดปุ่มย้อนกลับของโปรแกรม (ลูกศรชี้ซ้ายมุมซ้ายบน) เพื่อกลับมาหน้าตรวจสอบ",
        ],
        img: "step-05-form.png",
        imgAlt:
          "หน้าแบบฟอร์มจริงที่เปิดจากปุ่มดู แสดงแถบวงกลมหมายเลขส่วนด้านบนและเนื้อหาส่วนแรก",
        caption:
          "หน้าแบบฟอร์มจริง — แถบวงกลมด้านบน (ในกรอบสีแดง) ใช้กดข้ามไปดูแต่ละส่วนได้ทันที ไม่ต้องกรอกข้อมูล",
      },
      {
        title: "(ถ้าต้องการ) กด “คัดลอกลิงก์” เพื่อส่งลิงก์ฟอร์มให้คนอื่น",
        body: [
          "ปุ่มนี้ไม่บังคับ — ใช้เมื่อท่านอยากส่งลิงก์ของฟอร์มฉบับนั้นให้ผู้อื่น (เช่น อาจารย์ท่านอื่น) เปิดดูได้ตรงโดยไม่ต้องไล่หาจากหน้าแรก",
          "กดแล้วข้อความบนปุ่มจะเปลี่ยนเป็น “คัดลอกแล้ว” พร้อมเครื่องหมายถูกประมาณหนึ่งวินาที แปลว่าระบบจำลิงก์ไว้ในเครื่องแล้ว นำไปวางที่อีเมลหรือไลน์ได้เลย",
        ],
        img: "step-06-copied.png",
        imgAlt: "ปุ่มคัดลอกลิงก์เปลี่ยนเป็นข้อความคัดลอกแล้วพร้อมเครื่องหมายถูก",
        caption:
          "หลังกด “คัดลอกลิงก์” ปุ่มจะเปลี่ยนเป็น “คัดลอกแล้ว” พร้อมเครื่องหมายถูกชั่วครู่แบบในภาพ — แปลว่าลิงก์พร้อมนำไปวางแล้ว",
      },
      {
        title: "กด “ดาวน์โหลด” เมื่อต้องการไฟล์ Word ของฟอร์มฉบับนั้น",
        body: [
          "กดปุ่ม “ดาวน์โหลด” (ปุ่มขวาสุดในแถวปุ่มเล็ก หมายเลข 3 ในภาพด้านบน) เครื่องจะบันทึกไฟล์ Word นามสกุล .docx ลงในโฟลเดอร์ “ดาวน์โหลด” ของเครื่องท่านโดยอัตโนมัติ เปิดด้วย Microsoft Word หรือโปรแกรมเอกสารอื่นได้ทันที",
          "ไฟล์นี้มีคำถามครบทุกข้อของฟอร์มนั้น เหมาะสำหรับอ่านแบบกระดาษ หรือแก้ไข/ใส่หมายเหตุเมื่อพบข้อผิดพลาดแล้วส่งกลับให้ศูนย์สหกิจฯ",
        ],
        img: "step-07-download.png",
        imgAlt: "กรอบสีแดงล้อมรอบปุ่มดาวน์โหลดในคอลัมน์การดำเนินการ",
        caption:
          "กรอบสีแดงคือปุ่ม “ดาวน์โหลด” — กดแล้วไฟล์ .docx จะไปอยู่ในโฟลเดอร์ดาวน์โหลดของเครื่องท่าน",
      },
      {
        title: "กด “ยืนยันว่าตรวจสอบแล้ว” เมื่อฟอร์มฉบับนั้นถูกต้องครบถ้วน",
        body: [
          "กดปุ่มสีเข้ม “ยืนยันว่าตรวจสอบแล้ว” (ปุ่มใหญ่เต็มความกว้าง หมายเลข 4 ในภาพด้านบน) — กล่องยืนยันจะเด้งขึ้นกลางหน้าจอ",
          "ในกล่องมีสรุปว่ากำลังยืนยันฟอร์มไหนของหลักสูตรไหน ให้กรอกครบ 3 ช่องที่มีเครื่องหมาย * สีแดง: “ชื่อ-สกุลผู้ตรวจ” “อีเมล” และ “เบอร์โทรศัพท์”",
          "ติ๊กช่อง “ฉันได้ตรวจสอบเนื้อหาแบบประเมินนี้แล้วว่าครบถ้วนถูกต้อง” แล้วกดปุ่มสีเข้ม “ยืนยันการตรวจสอบ” — ถ้ากรอกไม่ครบหรือยังไม่ติ๊ก ปุ่มจะเป็นสีจางกดไม่ได้",
          "ถ้าเปิดกล่องมาแล้วยังไม่พร้อมยืนยัน กด “ยกเลิก” หรือกดพื้นหลังมืด ๆ รอบกล่องเพื่อปิดได้ ไม่มีอะไรถูกบันทึก",
        ],
        img: "step-08-dialog.png",
        imgAlt:
          "กล่องยืนยันการตรวจสอบที่เด้งขึ้นกลางจอ มีช่องกรอกชื่อ-สกุล อีเมล เบอร์โทรศัพท์ และช่องติ๊กยืนยัน",
        caption:
          "กล่อง “ยืนยันการตรวจสอบ” — กรอก 3 ช่องที่มีเครื่องหมาย * แล้วติ๊กช่องยืนยันก่อนกดปุ่มสีเข้ม (ภาพนี้ยังไม่ได้กรอก)",
      },
      {
        title: "กรอกข้อมูลผู้ตรวจแล้วกด “ยืนยันการตรวจสอบ”",
        body: [
          "พิมพ์ชื่อ-สกุลจริงของท่าน อีเมล และเบอร์โทรที่ติดต่อได้ — ข้อมูลนี้ถูกบันทึกเป็นหลักฐานว่าใครเป็นผู้ตรวจฟอร์มฉบับนี้",
          "เมื่อกรอกครบและติ๊กช่องยืนยันแล้ว ปุ่ม “ยืนยันการตรวจสอบ” จะเข้มขึ้นกดได้ — กดปุ่มนั้นเพื่อบันทึก",
        ],
        img: "step-09-dialog-filled.png",
        imgAlt:
          "กล่องยืนยันที่กรอกข้อมูลครบแล้ว ช่องติ๊กถูกติ๊ก และปุ่มยืนยันการตรวจสอบพร้อมกด",
        caption:
          "ตัวอย่างกล่องที่กรอกครบแล้ว — กรอบสีแดงคือปุ่ม “ยืนยันการตรวจสอบ” ที่พร้อมกด (ชื่อและอีเมลในภาพเป็นข้อมูลตัวอย่าง)",
      },
      {
        title: "ตรวจว่าป้ายเปลี่ยนเป็น “ตรวจแล้ว” แล้วทำฟอร์มถัดไป",
        body: [
          "หลังกดยืนยัน กล่องจะปิดไปเอง และป้ายสถานะของฟอร์มนั้นเปลี่ยนจาก “ยังไม่ตรวจ” สีเหลืองเป็น “ตรวจแล้ว” สีเขียว พร้อมบรรทัดเล็ก ๆ ว่า “ตรวจโดย ชื่อของท่าน · วันเวลา”",
          "ปุ่มสีเข้มจะเปลี่ยนเป็น “ตรวจซ้ำ” — กดได้เสมอถ้าต้องการยืนยันรอบใหม่ (ระบบจำทุกครั้งและแสดงรอบล่าสุด)",
          "ทำขั้นที่ 4–8 ซ้ำกับฟอร์มอีก 2 ฉบับที่เหลือ จนทั้ง 3 บรรทัดขึ้น “ตรวจแล้ว” ครบ ถือว่างานตรวจสอบของหลักสูตรนี้เสร็จสมบูรณ์",
        ],
        img: "step-10-reviewed.png",
        imgAlt:
          "หน้าตรวจสอบหลังยืนยันแล้ว ป้ายสถานะเปลี่ยนเป็นสีเขียวตรวจแล้วพร้อมชื่อผู้ตรวจและเวลา",
        caption:
          "สถานะเปลี่ยนเป็น “ตรวจแล้ว” สีเขียวพร้อมชื่อผู้ตรวจและเวลา (ในกรอบสีแดง) — ทำซ้ำจนครบทั้ง 3 ฟอร์ม",
      },
    ],

    glossaryTitle: "4. คำศัพท์ที่ควรรู้",
    glossary: [
      {
        term: "สำนักวิชา",
        def: "หน่วยงานระดับคณะของมหาวิทยาลัยวลัยลักษณ์ เช่น สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์ — ในหน้าแรกของระบบ รายชื่อจะจัดกลุ่มตามสำนักวิชา",
      },
      {
        term: "หลักสูตร",
        def: "หลักสูตรระดับปริญญาที่เปิดสอนโดยสำนักวิชา เช่น หลักสูตรรัฐศาสตร์บัณฑิต — ชุดคำถามแบบประเมินผูกกับหลักสูตรโดยตรง หลักสูตรละชุด",
      },
      {
        term: "สถานประกอบการ",
        def: "บริษัทหรือหน่วยงานที่รับนักศึกษาไปปฏิบัติงานสหกิจศึกษา — พี่เลี้ยง/หัวหน้างานของที่นั่นเป็นผู้กรอกแบบประเมินฝั่งนี้",
      },
      {
        term: "อาจารย์นิเทศ",
        def: "อาจารย์ของมหาวิทยาลัยที่เดินทางไปนิเทศและประเมินนักศึกษาระหว่างปฏิบัติงาน — เป็นผู้กรอกแบบประเมินอีกฉบับหนึ่ง",
      },
      {
        term: "ผลลัพธ์การเรียนรู้ (LOs)",
        def: "ชุดคำถามว่า “นักศึกษาควรทำอะไรได้บ้างหลังปฏิบัติงาน” ของแต่ละหลักสูตร — ใช้เป็นคำถามหลักร่วมกันในทั้ง 3 ฟอร์ม",
      },
      {
        term: "ศูนย์สหกิจศึกษาฯ",
        def: "ศูนย์สหกิจศึกษาและพัฒนาอาชีพ มหาวิทยาลัยวลัยลักษณ์ — หน่วยงานที่ดูแลระบบนี้และเป็นผู้รับไฟล์แก้ไขกลับจากผู้ตรวจ",
      },
    ],

    faqTitle: "5. คำถามที่พบบ่อยและการแก้ปัญหา",
    faq: [
      {
        q: "ฉันเผลอพิมพ์หรือติ๊กอะไรไว้ในฟอร์ม ข้อมูลจะถูกนำไปใช้จริงไหม",
        a: [
          "ไม่ — ระบบนี้ไม่ได้เก็บคำตอบจริงของใครเลย หน้าที่ของมันคือให้ “ดูตัวอย่าง” แบบประเมินเท่านั้น พิมพ์หรือติ๊กลองได้เต็มที่ แล้วปิดหน้าต่างทิ้งได้เลย",
          "ข้อมูลที่พิมพ์ไว้อาจถูกจำไว้ในเครื่องของท่านชั่วคราว (ระบบจำร่างไว้ให้อัตโนมัติ จุดนี้มีไว้ช่วยผู้กรอกจริงในอนาคต) — แต่ข้อมูลนั้นอยู่แค่ในเครื่องของท่านเอง ไม่ได้ส่งไปไหน และไม่ถูกนำไปใช้เป็นข้อมูลการประเมินใด ๆ",
        ],
      },
      {
        q: "เจอคำถามพิมพ์ผิด คำถามขาด หรือเนื้อหาไม่ตรงต้นฉบับ ต้องแก้ยังไง",
        a: [
          "อย่ากดยืนยันฟอร์มฉบับนั้น — กดปุ่ม “ดาวน์โหลด” ของฟอร์มนั้นเพื่อเอาไฟล์ Word ออกมา แก้ไขข้อความหรือใส่หมายเหตุในไฟล์ แล้วส่งไฟล์กลับให้ศูนย์สหกิจศึกษาฯ ทางช่องทางที่ติดต่อกันอยู่ (อีเมล/ไลน์) พร้อมบอกว่าเป็นฟอร์มไหนของหลักสูตรไหน",
          "ระบบไม่มีช่องให้ผู้ตรวจแก้คำถามบนหน้าเว็บ — การแก้เนื้อหาทำผ่านไฟล์ Word เท่านั้น เมื่อศูนย์ฯ แก้ในระบบแล้ว ท่านค่อยกลับมาตรวจและกดยืนยันอีกครั้ง",
        ],
      },
      {
        q: "กดยืนยันไปแล้ว เพิ่งมาเจอข้อผิดพลาดทีหลัง ทำยังไง",
        a: [
          "แจ้งศูนย์สหกิจศึกษาฯ ทันที ระบุหลักสูตรและฟอร์มที่มีปัญหา — การยืนยันที่ผ่านไปแล้วถูกเก็บเป็นประวัติ แก้หรือลบเองไม่ได้",
          "เมื่อเนื้อหาได้รับการแก้ไขแล้ว ท่านสามารถกดปุ่ม “ตรวจซ้ำ” เพื่อยืนยันรอบใหม่ได้เสมอ — ป้ายจะแสดงชื่อและเวลาของรอบล่าสุดเสมอ",
        ],
      },
      {
        q: "จะรู้ได้ยังไงว่าใครยืนยันไปแล้วบ้าง",
        a: [
          "ดูใต้ป้าย “ตรวจแล้ว” ในคอลัมน์สถานะ — จะมีบรรทัดเล็ก ๆ เขียนว่า “ตรวจโดย ชื่อผู้ตรวจ · วันเวลา” เสมอ ถ้ายังเป็นป้ายเหลือง “ยังไม่ตรวจ” แปลว่ายังไม่มีใครยืนยันฟอร์มนั้น",
        ],
      },
      {
        q: "ต้องยืนยันครบทั้ง 3 ฟอร์มไหม หรือยืนยันรวมครั้งเดียวได้",
        a: [
          "ต้องยืนยันแยกทีละฟอร์ม ครบทั้ง 3 ฉบับ (สถานประกอบการ / อาจารย์นิเทศ / นักศึกษา) — สถานะของแต่ละฟอร์มเป็นอิสระต่อกัน การยืนยันฟอร์มหนึ่งไม่ทำให้อีกสองฉบับเปลี่ยนสถานะ",
        ],
      },
      {
        q: "หน้าเว็บแสดงเป็นภาษาอังกฤษ จะเปลี่ยนเป็นภาษาไทยยังไง",
        a: [
          "กดปุ่ม “ไทย” ที่มุมขวาบนของหน้าเว็บ — สลับภาษาได้ทุกหน้า บางหลักสูตร (เช่น หลักสูตรนานาชาติ) จะเปิดภาษาอังกฤษให้อัตโนมัติ",
        ],
      },
      {
        q: "กด “ดาวน์โหลด” แล้วหาไฟล์ไม่เจอ",
        a: [
          "ไฟล์จะถูกบันทึกลงโฟลเดอร์ “ดาวน์โหลด” (Downloads) ของเครื่องท่านโดยอัตโนมัติ ชื่อไฟล์ขึ้นต้นด้วยชนิดฟอร์มและรหัสหลักสูตร นามสกุล .docx — ลองดูแถบแจ้งเตือนดาวน์โหลดที่มุมจอของโปรแกรมเว็บด้วย บางโปรแกรมจะแสดงไฟล์ที่เพิ่งโหลดไว้ตรงนั้น",
        ],
      },
      {
        q: "กดปุ่ม “ยืนยันการตรวจสอบ” ในกล่องไม่ได้ (ปุ่มเป็นสีจาง)",
        a: [
          "แปลว่ายังกรอกไม่ครบ — ตรวจว่ากรอกครบทั้ง 3 ช่อง (ชื่อ-สกุลผู้ตรวจ / อีเมล / เบอร์โทรศัพท์) และติ๊กช่อง “ฉันได้ตรวจสอบเนื้อหาแบบประเมินนี้แล้วว่าครบถ้วนถูกต้อง” แล้ว อีเมลต้องมีเครื่องหมาย @ ด้วย",
        ],
      },
      {
        q: "กด “ส่งแบบประเมิน” ในหน้าฟอร์มแล้วเด้งเตือนสีแดง เป็นอะไรไหม",
        a: [
          "ไม่เป็นไร — ปุ่ม “ส่งแบบประเมิน” มีไว้สำหรับผู้กรอกจริง ไม่ใช่งานของผู้ตรวจ การเด้งเตือนแค่บอกว่ายังกรอกไม่ครบ ให้ปิดหน้าฟอร์มแล้วกลับไปกด “ยืนยันว่าตรวจสอบแล้ว” ในหน้าตรวจสอบตามปกติ",
        ],
      },
      {
        q: "ต้องล็อกอินหรือสมัครสมาชิกก่อนใช้งานไหม",
        a: [
          "ไม่ต้อง — ระบบนี้ไม่มีล็อกอิน เปิดลิงก์แล้วใช้งานได้ทันที ทั้งบนคอมพิวเตอร์และโทรศัพท์มือถือ",
        ],
      },
    ],

    staffTitle: "6. หมายเหตุสำหรับเจ้าหน้าที่ศูนย์สหกิจฯ",
    staffBody: [
      "ส่วนนี้สำหรับเจ้าหน้าที่ที่แก้ไขเนื้อคำถามในระบบโดยตรง — ผู้ตรวจทั่วไปข้ามได้เลย",
      "การแก้ไขชุดคำถามทำที่หน้า “แก้ไข” ของแต่ละหลักสูตร (เข้าจากปุ่มแก้ไขบนหน้าแบบฟอร์ม) — เมื่อกด “บันทึกการเปลี่ยนแปลง” ระบบจะเด้งกล่อง “ยืนยันตัวตนก่อนบันทึก” ให้กรอก ชื่อ-สกุล / อีเมล / เบอร์โทรศัพท์ และติ๊กยืนยันก่อนบันทึกลงประวัติการแก้ไข เป็นหลักฐานว่าใครเป็นผู้แก้",
      "กล่องนั้นคนละใบกับกล่อง “ยืนยันการตรวจสอบ” ในคู่มือนี้ — อันนั้นไว้บันทึกว่าใครแก้ไข อันนี้ไว้บันทึกว่าใครตรวจแล้ว อย่าสับสน",
    ],

    backHome: "กลับหน้าแรก",
  },

  en: {
    pageTitle: "User Guide",
    pageSubtitle:
      "For evaluation-form reviewers — a step-by-step walkthrough from opening the website for the first time to confirming your review, written for people who have never used this system.",
    pdfButton: "Download PDF",
    pdfNote:
      "The same content as this page — handy for printing or forwarding to colleagues who cannot open the website.",
    noticeTitle: "Important — read this first",
    noticeBody:
      "This system does not store anyone's real answers. Its only job is to let you preview the evaluation forms before they are used, check that every question is complete and correct, and confirm that you reviewed them. If you accidentally type or tick anything inside a form, do not worry — simply close the tab. Nothing is ever used as real data.",
    tocTitle: "Contents — select a section to jump to it",
    toc: [
      { id: "what-is", label: "1. What this system is, and what you need to do" },
      { id: "find", label: "2. Part 1 — Opening a program's review page (steps 1–3)" },
      { id: "review", label: "3. Part 2 — Reviewing and confirming each form (steps 4–8)" },
      { id: "glossary", label: "4. Terms worth knowing" },
      { id: "faq", label: "5. Frequently asked questions & troubleshooting" },
      { id: "staff", label: "6. Note for coop-center staff" },
    ],

    whatTitle: "1. What this system is, and what you need to do",
    whatBody: [
      "This system holds the evaluation forms and questionnaires for every cooperative-education course at Walailak University. Its single job is to let the people involved preview the forms ahead of time and confirm the questions are complete and correct before the forms go live.",
    ],
    whatFormsIntro: "Each program has 3 forms, for 3 different audiences:",
    whatFormsSuffix:
      "The core question set (the learning outcomes — LOs) is the same across all 3 forms; they differ in who fills them in and in their supporting questions.",
    whoTitle: "Your job in one glance",
    whoBody: [
      "1. Open the review page for the program you are responsible for (Part 1).",
      "2. View the contents of all 3 forms and read whether the questions are complete, correctly worded, and have the right answer options (Part 2).",
      "3. If everything is correct → press the “Confirm reviewed” button for each form.",
      "4. If you spot an error → do NOT confirm that form. Press “Download” to get its Word file, fix or annotate it, and send the file back to the Cooperative Education Center through the channel you already use (e.g. email or LINE) — reviewers cannot edit questions on the website itself.",
    ],
    noLoginNote:
      "There is no login and no sign-up — open the link and start straight away, on a computer or a phone.",

    part1Title: "2. Part 1 — Opening a program's review page",
    part1Intro: [
      "Everything starts from the system's home page. Follow steps 1–3 in order — it takes less than a minute.",
    ],
    part1Steps: [
      {
        title: "Open the home page and click your school",
        body: [
          "Open the link the Cooperative Education Center sent you. The home page lists every school as a row in a table.",
          "Find the row of the school that owns the program you need to review — if the list is long, type the school name into the “Search schools…” box above the table to filter it down.",
          "Once found, click anywhere on that school's row (the whole row is clickable — note the grey arrow on its right edge).",
        ],
        img: "step-01-home.png",
        imgAlt:
          "The system home page showing the table of schools with a red box around the row to click",
        caption:
          "The home page — the red box marked 1 is the school row to click (this example shows the School of Political Science and Public Administration; yours may differ).",
      },
      {
        title: "Click the program you want to review",
        body: [
          "The next page lists every program inside that school, with its code, status, and chips showing the 3 forms (Workplace / Advisor / Student).",
          "A green “Available” badge means the program's question set is ready to review. A yellow “Not available” badge means no question set has been loaded yet — contact the staff before reviewing.",
          "Click anywhere on your program's row.",
        ],
        img: "step-02-programs.png",
        imgAlt:
          "The school's program list with a red box around the program row to click",
        caption:
          "The red box marked 2 is the program row to click — the green “Available” badge means its questions are ready to review.",
      },
      {
        title: "The review page — the hub of your work",
        body: [
          "After clicking a program you arrive at its “Curriculum review” page. The table here has 3 rows = the program's 3 forms.",
          "The left column “Form” shows the form's name and who fills it in (the key word is underlined in bold). The middle “Status” column shows whether it has been reviewed. The right “Actions” column holds every button you will use.",
          "Remember this page — every review task happens right here.",
        ],
        img: "step-03-review.png",
        imgAlt:
          "The curriculum review page showing a table with 3 rows, one per form, with status badges and buttons",
        caption:
          "The review page — its 3 rows are the program's 3 forms. Note the yellow “Not reviewed” badges in the Status column.",
      },
    ],

    part2Title: "3. Part 2 — Reviewing and confirming each form",
    part2Intro: [
      "Work through steps 4–8 one form at a time until all 3 are done. Any order is fine — but all three must be confirmed.",
      "Each form row has 4 buttons. Study the picture and the table below before you start.",
    ],
    buttonsTitle: "What each form's 4 buttons do",
    buttonsIntro: "Refer to numbers 1–4 in the red boxes of the picture below:",
    buttonsImg: "step-04-actions.png",
    buttonsImgAlt:
      "The actions column of the first form with red boxes numbered 1–4 around View, Copy link, Download and Confirm reviewed",
    buttonsCaption:
      "A form's 4 buttons — a row of 3 small buttons on top (1 View · 2 Copy link · 3 Download) and the wide dark button below (4 Confirm reviewed)",
    buttons: [
      {
        name: "View",
        does: "Opens the real form on screen — you see exactly what the real respondent will see. Use this button to read and check the content.",
      },
      {
        name: "Copy link",
        does: "Copies that form's link onto your device; the button briefly changes to “Copied!”. Paste it (Ctrl+V, or tap-and-hold → Paste) into an email or chat so someone else can open this exact form directly.",
      },
      {
        name: "Download",
        does: "Saves that form as a Word file (.docx) into your device's Downloads folder — use it to read on paper, or to fix mistakes and send the file back to the coop center.",
      },
      {
        name: "Confirm reviewed",
        does: "The wide dark button — press it only when you have fully reviewed that form and it is correct. A popup asks for your name, email and phone number as proof of review.",
      },
    ],
    checklistTitle: "What to check while viewing a form",
    checklist: [
      "The form's title matches the intended audience (Workplace / Faculty Advisor / Student).",
      "Every question from the program's source document is present — none missing or duplicated.",
      "The wording and spelling are correct and easy to understand.",
      "Each question's score options are complete, and each level's description matches the program's rubric.",
      "The general-information fields (name, student ID, workplace, etc.) are all present.",
    ],
    part2Steps: [
      {
        title: "Press “View” to open a form and read it",
        body: [
          "Press “View” (the leftmost small button, number 1 in the picture above). The real form opens in the same page — it looks exactly as the real respondent will see it.",
          "The form is split into sections — the numbered circles at the top are the sections. Click any section name to jump straight to it, or use the “Next / Back” buttons at the bottom to walk through them.",
          "You can move between sections freely without filling anything in — and you may type or tick things to see how it behaves; anything you enter is never used as real data.",
          "The View / Edit / Print / Download Word / Edit history toolbar row under the page title is staff tooling — ignore it. When finished, use your browser's back button (top-left arrow) to return to the review page.",
        ],
        img: "step-05-form.png",
        imgAlt:
          "The real form opened via the View button, showing the numbered section circles at the top and the first section",
        caption:
          "The real form — the numbered circles at the top (inside the red box) let you jump to any section instantly without filling anything in.",
      },
      {
        title: "(Optional) Press “Copy link” to share a form's link",
        body: [
          "This button is optional — use it when you want to send that form's link to someone else (e.g. a colleague) so they can open the exact same form without browsing from the home page.",
          "After you press it, the button briefly changes to “Copied!” with a check mark for about a second — the link is then ready to paste into an email or chat.",
        ],
        img: "step-06-copied.png",
        imgAlt: "The copy-link button showing the Copied! state with a check mark",
        caption:
          "After pressing “Copy link”, the button briefly shows “Copied!” with a check mark as in this picture — the link is ready to paste.",
      },
      {
        title: "Press “Download” when you want the form as a Word file",
        body: [
          "Press “Download” (the rightmost small button, number 3 in the picture above). A Word file (.docx) is saved automatically into your device's Downloads folder — open it with Microsoft Word or another document app.",
          "The file contains every question of that form — handy for reading on paper, or for fixing mistakes and sending back to the coop center.",
        ],
        img: "step-07-download.png",
        imgAlt: "A red box around the Download button in the actions column",
        caption:
          "The red box is the “Download” button — the .docx file lands in your Downloads folder.",
      },
      {
        title: "Press “Confirm reviewed” once that form is correct",
        body: [
          "Press the dark “Confirm reviewed” button (the wide button under the small ones, number 4 in the picture above) — a confirmation popup appears in the middle of the screen.",
          "The popup summarizes which form of which program you are confirming. Fill in all 3 fields marked with a red *: “Reviewer's full name”, “Email” and “Phone number”.",
          "Tick the box “I have reviewed this evaluation form and confirm it is complete and correct.” then press the dark “Confirm review” button — if a field is empty or the box is unticked, the button stays pale and cannot be pressed.",
          "If you opened the popup but are not ready to confirm, press “Cancel” or click the dark backdrop to close it — nothing is saved.",
        ],
        img: "step-08-dialog.png",
        imgAlt:
          "The confirm-review popup in the middle of the screen with fields for name, email, phone and a confirmation checkbox",
        caption:
          "The “Confirm review” popup — fill the 3 fields marked * and tick the confirmation box before pressing the dark button (shown empty here).",
      },
      {
        title: "Enter your details and press “Confirm review”",
        body: [
          "Type your real full name, email and a phone number where you can be reached — this is recorded as proof of who reviewed the form.",
          "Once everything is filled and the box is ticked, the “Confirm review” button turns dark and clickable — press it to save.",
        ],
        img: "step-09-dialog-filled.png",
        imgAlt:
          "The popup fully filled in, the checkbox ticked, and the Confirm review button ready",
        caption:
          "A completed popup — the red box is the “Confirm review” button ready to press (the name and email shown are examples).",
      },
      {
        title: "Check the badge turned to “Reviewed”, then do the next form",
        body: [
          "After confirming, the popup closes and that form's badge changes from yellow “Not reviewed” to green “Reviewed”, with a small line reading “Reviewed by your name · date time”.",
          "The dark button becomes “Review again” — press it any time to confirm a fresh round (every confirmation is recorded; the latest one is shown).",
          "Repeat steps 4–8 for the remaining 2 forms. When all 3 rows show “Reviewed”, this program's review is complete.",
        ],
        img: "step-10-reviewed.png",
        imgAlt:
          "The review page after confirming — the badge is now a green Reviewed with the reviewer's name and time",
        caption:
          "The status turned to a green “Reviewed” with the reviewer name and time (inside the red box) — repeat until all 3 forms are done.",
      },
    ],

    glossaryTitle: "4. Terms worth knowing",
    glossary: [
      {
        term: "School",
        def: "A faculty-level unit of Walailak University (e.g. the School of Political Science and Public Administration). The home page groups everything by school.",
      },
      {
        term: "Program",
        def: "A degree program run by a school (e.g. the Bachelor of Political Science). Each evaluation question set belongs to exactly one program.",
      },
      {
        term: "Workplace",
        def: "The company or organisation hosting a student's cooperative-education placement — its on-site supervisor fills in the first form.",
      },
      {
        term: "Faculty Advisor",
        def: "The university lecturer who visits and evaluates the student during the placement — they fill in the second form.",
      },
      {
        term: "Learning Outcomes (LOs)",
        def: "The set of “what should the student be able to do” questions for each program — the shared core questions appearing in all 3 forms.",
      },
      {
        term: "Cooperative Education Center",
        def: "The Center for Cooperative Education and Career Development, Walailak University — the unit that runs this system and receives corrected files back from reviewers.",
      },
    ],

    faqTitle: "5. Frequently asked questions & troubleshooting",
    faq: [
      {
        q: "I accidentally typed or ticked things inside a form — will that data be used?",
        a: [
          "No — this system never stores anyone's real answers; it exists only to preview the forms. Feel free to type or tick while exploring, then simply close the tab.",
          "What you typed may be remembered on your own device briefly (the system keeps a draft automatically — a feature meant for real respondents later) — but that draft stays on your device only, goes nowhere, and is never used as real evaluation data.",
        ],
      },
      {
        q: "I found a typo, a missing question, or content that differs from the source document — how do I fix it?",
        a: [
          "Do NOT confirm that form. Press its “Download” button to get the Word file, edit the wording or add comments in the file, then send it back to the Cooperative Education Center through the channel you already use (email/LINE), saying which form of which program it is.",
          "Reviewers cannot edit questions on the website — corrections are made via the Word file only. Once the center updates the system, come back, review again, and then confirm.",
        ],
      },
      {
        q: "I already confirmed but just spotted an error — what now?",
        a: [
          "Tell the Cooperative Education Center immediately, naming the program and the form — past confirmations are kept as history and cannot be edited or deleted by you.",
          "After the content is fixed, press the “Review again” button to confirm a fresh round — the badge always shows the latest reviewer and time.",
        ],
      },
      {
        q: "How do I know who has already confirmed?",
        a: [
          "Look under the green “Reviewed” badge in the Status column — there is always a small line reading “Reviewed by name · date time”. A yellow “Not reviewed” badge means nobody has confirmed that form yet.",
        ],
      },
      {
        q: "Do I have to confirm all 3 forms, or can I confirm once for all?",
        a: [
          "Each form is confirmed separately — all 3 must be done (Workplace / Faculty Advisor / Student). The statuses are independent: confirming one form does not change the other two.",
        ],
      },
      {
        q: "The website shows English — how do I switch to Thai?",
        a: [
          "Press the “ไทย” button at the top-right of the page — every page has the language switcher. Some programs (e.g. international programs) open in English automatically.",
        ],
      },
      {
        q: "I pressed “Download” but cannot find the file",
        a: [
          "The file is saved automatically into your device's Downloads folder, named after the form type and program code, ending in .docx — also check your browser's download pop-up at the corner of the window, which lists recently downloaded files.",
        ],
      },
      {
        q: "The “Confirm review” button in the popup stays pale — I cannot press it",
        a: [
          "That means something is still missing — check that all 3 fields (Reviewer's full name / Email / Phone number) are filled and that the confirmation box is ticked. The email must contain an @ sign.",
        ],
      },
      {
        q: "I pressed the form's submit button and a red warning appeared — did I break something?",
        a: [
          "Nothing is wrong — the submit button is for real respondents, not for reviewers. The warning only says the form is not fully filled. Close the form and press “Confirm reviewed” on the review page as usual.",
        ],
      },
      {
        q: "Do I need an account or a password?",
        a: [
          "No — there is no login. Open the link and start straight away, on a computer or a phone.",
        ],
      },
    ],

    staffTitle: "6. Note for coop-center staff",
    staffBody: [
      "This section is for staff who edit question content directly in the system — general reviewers can skip it.",
      "Question sets are edited on each program's edit page (via the edit button on the form page). Pressing “Save changes” opens a popup that asks for name / email / phone plus a confirmation tick before writing to the edit history — it records who made the change.",
      "That popup is a different one from the “Confirm review” popup in this guide — one records who edited, the other records who reviewed. Do not confuse them.",
    ],

    backHome: "Back to home",
  },
};
