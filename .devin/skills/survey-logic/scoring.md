# Scoring

- ระบุ scoring version และเก็บ raw responses แยกจาก derived scores
- กำหนด mapping ของทุกตัวเลือก รวม “ไม่เกี่ยวข้อง” และ missing ก่อน implement
- ใช้สูตรที่โปร่งใส: item score, reverse score, weight, aggregation, normalization และ rounding
- Reverse-score สำหรับ scale 1..k ด้วยสูตร `k + 1 - response`
- ห้ามแปลง missing หรือ not-applicable เป็น 0 เว้นแต่โมเดลการวัดกำหนดเช่นนั้นอย่างชัดเจน
- กำหนด minimum answered items ก่อนคำนวณ subscale/overall score
- หลีกเลี่ยง weight ที่ไม่มีเหตุผลทางเนื้อหาหรือหลักฐาน
- เกณฑ์ผ่าน/ระดับผลต้องกำหนดก่อนดูผลจริง และต้องระบุว่าอิงมาตรฐานใด
- ทดสอบค่าต่ำสุด สูงสุด midpoint reverse items missing และ floating-point rounding
