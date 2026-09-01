# Response Quality

ใช้หลายสัญญาณร่วมกันและเก็บเป็น flag เพื่อ review ห้ามลบ response จากสัญญาณเดียว

สัญญาณที่พิจารณาได้:
- Completion time ต่ำผิดปกติเมื่อเทียบกับความยาวและ distribution
- Straight-lining ใน matrix โดยคำนึงว่าความคิดเห็นเดียวกันอาจเป็นคำตอบจริง
- Long-string index หรือความแปรปรวนต่ำผิดปกติ
- Contradictory answers เฉพาะคู่คำถามที่ควรสัมพันธ์กันจริง
- Missing rate สูงหรือหยุดตอบกลางทาง
- Duplicate submission จาก identifier ที่ชอบธรรมและเคารพ privacy
- Open-text ที่ไม่เกี่ยวข้องหรือเป็น pattern อัตโนมัติ

รายงาน threshold, เหตุผล, จำนวนที่ถูก flag และ sensitivity analysis เมื่อ exclusion มีผลต่อข้อสรุป
