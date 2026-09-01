---
name: form-design
description: ออกแบบหรือปรับปรุงฟอร์มและแบบประเมินให้ชัดเจน ใช้ง่าย เข้าถึงได้ และเก็บข้อมูลอย่างมีคุณภาพ
argument-hint: "<เป้าหมายฟอร์มหรือไฟล์ที่ต้องการปรับ>"
triggers:
  - user
  - model
---

# Form Design

ใช้ Skill นี้เมื่อสร้าง ตรวจสอบ หรือแก้ไขฟอร์ม แบบสอบถาม และแบบประเมิน

## Workflow

1. ระบุวัตถุประสงค์ ผู้ตอบ การนำข้อมูลไปใช้ และข้อมูลที่จำเป็นจริง
2. ตรวจโครงสร้างคำถามจาก `question-types.md`
3. ใช้หลัก UX และ accessibility จาก `ux-rules.md`
4. เลือกชนิดคำถามที่ลดภาระทางความคิดและให้ข้อมูลตรงกับวัตถุประสงค์
5. จัดกลุ่มคำถามจากง่ายไปยาก และใช้ progressive disclosure กับส่วนขั้นสูง
6. กำหนด label, helper text, required state, validation และ error message ให้ครบ
7. ตรวจ edge cases เช่น ค่าว่าง ไม่เกี่ยวข้อง ข้อความยาว มือถือ keyboard และ screen reader
8. เทียบตัวอย่างใน `examples/good-bad.md` ก่อนสรุปหรือแก้โค้ด

## Output

รายงานหรือ implementation ต้องระบุ:
- วัตถุประสงค์และกลุ่มผู้ตอบ
- โครงสร้าง section และลำดับคำถาม
- ชนิดคำถามและเหตุผล
- Required/optional พร้อมเหตุผล
- Validation และข้อความผิดพลาด
- เงื่อนไข branching/skip logic (ถ้ามี)
- Accessibility และ responsive behavior
