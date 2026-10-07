# ส่งต่อแบบประเมิน LO ไป coop-Evaluations

โปรเจกต์ LO เป็นต้นทางเนื้อหาแบบประเมิน ระบบใช้งานปลายทางคือ [coop-evaluation](https://github.com/coopwu69/coop-evaluation) งานย้ายอยู่ branch `feat/migrate-los-forms`

ผู้ใช้ยืนยันให้ย้ายเฉพาะหลักสูตรที่มีคนตรวจแล้ว ชุดแรกเลือกยืนยันครบสถานประกอบการ อาจารย์ และนักศึกษา ทั้งหมด 23 หลักสูตร รวม 195 ข้อ LO ไม่เติมคำแปลหรือ rubric ที่ยังขาดแทนผู้ตรวจ

ขั้นตอนอัปเดตครั้งต่อไปอยู่ใน [skill coop-update-reviewed-los](https://github.com/coopwu69/coop-evaluation/blob/feat/migrate-los-forms/.agents/skills/coop-update-reviewed-los/SKILL.md) รวม exporter แบบ read-only และตัวเทียบ snapshot ให้ใช้เครื่องมือชุดนั้นแทนสคริปต์ทดลองคัดลอกครั้งแรก

พาธ skill ในเครื่องนี้:

`C:\Users\Admin\OneDrive\เอกสาร\สหกิจ วลัยลักษณ์\ระบบ\coop-Evaluations\.agents\skills\coop-update-reviewed-los\SKILL.md`

อ่านสถานะล่าสุดจาก reference ของ skill และรายงานปลายทาง `docs/report-migrate-reviewed-los.md` ก่อนเริ่มงาน ใช้ข้อมูลฐาน LO ปัจจุบันตรวจการยืนยันและ revision ใหม่ ไม่ใช้จำนวนหลักสูตรในเอกสารนี้แทนสถานะจริง

ฟอร์มที่ย้ายแล้วใช้คะแนน 4 ระดับ ไทย/อังกฤษ และ tooltip พรีเมี่ยมตามต้นแบบ การบันทึกใช้ roster และ repository ของปลายทาง โดยเก็บ template ID, source commit, version และ snapshot คำถาม/ตัวเลือกในคำตอบ

การเปลี่ยน version ต้องรักษารายงานคำตอบรุ่นก่อน และไม่รวมกับรายงานเก่า 5 ระดับ ข้อจำกัดที่ยังต้องทำต่อคือทดสอบบันทึก Supabase จริงและพิจารณาการย้าย draft autosave/restore

วันที่ 7 ตุลาคม 2569 ผู้ใช้อนุญาต commit และ push งานทั้งสองโปรเจกต์ การนำขึ้น production ให้พิจารณาตามคำขอและสถานะทดสอบในรอบนั้น
