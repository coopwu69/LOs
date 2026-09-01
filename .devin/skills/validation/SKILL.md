---
name: validation
description: ออกแบบและตรวจ validation ของฟอร์มด้วย Zod หรือกลไกเดิมของโปรเจกต์ พร้อมข้อความผิดพลาดที่ช่วยแก้ไขได้
argument-hint: "<ฟอร์ม schema หรือไฟล์ที่ต้องตรวจ>"
triggers:
  - user
  - model
---

# Form Validation

1. ตรวจ schema, UI controls, API และฐานข้อมูลให้ใช้ความหมายเดียวกัน
2. อ่าน `validation-rules.md` และตัวอย่างใน `examples.md`
3. Validate ที่ client เพื่อ feedback และที่ server เพื่อความถูกต้อง/ความปลอดภัย
4. Normalize อย่างระมัดระวังก่อน validate โดยไม่เปลี่ยนความหมายของข้อมูล
5. แยก required, format, range, cross-field และ business-rule validation
6. เขียน error เป็นภาษาเดียวกับฟอร์ม ระบุปัญหาและวิธีแก้
7. ทดสอบ valid, invalid, boundary, empty, Unicode/ภาษาไทย และ conditional fields

หากโปรเจกต์มี Zod ให้ใช้ schema เป็นแหล่งความจริงร่วมและ infer type แทนการประกาศ type ซ้ำ เมื่อเข้ากับสถาปัตยกรรมเดิม
