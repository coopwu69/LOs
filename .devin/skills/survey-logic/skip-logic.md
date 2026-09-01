# Skip Logic

- ใช้ skip logic เพื่อตัดคำถามที่ไม่เกี่ยวข้อง ไม่ใช่เพื่อซ่อนข้อมูลสำคัญจากผู้ตอบ
- แจ้งจำนวน/ความคืบหน้าแบบไม่ทำให้กระโดดถอยหลังเมื่อข้าม section
- ทุกเส้นทางต้องไปถึงหน้าสรุปหรือ submit ได้
- ผู้ใช้ต้องย้อนกลับได้โดยไม่สูญเสียคำตอบที่ยังเกี่ยวข้อง
- Hidden/skipped questions ต้องไม่ถูกบังคับ required และไม่สร้าง validation error
- แยกสถานะ `unanswered`, `skipped_by_logic`, `not_applicable` และ `prefer_not_to_answer`
- ทดสอบ first/last option, missing source answer, restored draft และคำตอบที่เปลี่ยนหลังย้อนกลับ
