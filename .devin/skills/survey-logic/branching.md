# Branching

- Branch ด้วย stable IDs และค่าคำตอบ ไม่อ้างอิงข้อความ label
- แต่ละ condition ต้อง mutually understandable และมี fallback path
- หลีกเลี่ยง branch ซ้อนลึกเกิน 3 ระดับ; แยกเป็น section หรือ state machine เมื่อซับซ้อน
- บันทึกเหตุผลของ branch และปลายทางใน decision table
- เมื่อผู้ใช้ย้อนกลับและเปลี่ยนคำตอบ ให้ประเมินเส้นทางใหม่ทันที
- กำหนดชัดเจนว่าคำตอบจาก branch เดิมจะถูกลบ เก็บเป็น draft หรือ exclude จากผลลัพธ์
- ห้ามให้ข้อมูลที่ซ่อนอยู่มีผลต่อ score โดยไม่ตั้งใจ

Decision table ขั้นต่ำ: source question, operator, expected value, destination, fallback และ answer-retention policy
