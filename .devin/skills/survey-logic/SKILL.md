---
name: survey-logic
description: ออกแบบ branching, skip logic และ scoring ของแบบสอบถามให้ตรวจสอบย้อนกลับและไม่มีเส้นทางตัน
argument-hint: "<แบบสอบถามหรือ flow ที่ต้องออกแบบ>"
triggers:
  - user
  - model
---

# Survey Logic

1. สร้างแผนภาพสถานะ/เส้นทางก่อน implement
2. ใช้ `branching.md` และ `skip-logic.md` เพื่อกำหนดเงื่อนไขและปลายทางทุกกรณี
3. ใช้ `scoring.md` เพื่อกำหนด mapping, weight, reverse scoring, missing data และการปัดเศษ
4. แยก stable question ID ออกจากข้อความที่แสดง
5. ระบุ default/fallback path เมื่อข้อมูลไม่ครบหรือเป็นค่าที่ไม่รู้จัก
6. ล้างคำตอบที่ซ่อนเมื่อไม่ควรถูกเก็บ หรือกำหนดนโยบายเก็บอย่างชัดเจน
7. ทดสอบทุก reachable path, back navigation, refresh/resume และการเปลี่ยนคำตอบต้นทาง

ส่งมอบ logic table หรือ pseudocode พร้อม test cases และ scoring specification ที่ตรวจสอบได้
