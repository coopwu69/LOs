# Validation Rules

- Required เฉพาะข้อมูลที่จำเป็น; optional field ที่ว่างไม่ควรเกิด format error
- Trim ข้อความเมื่อ whitespace ไม่มีความหมาย แต่ห้าม trim password หรือค่าที่ whitespace มีความหมาย
- แยก “ไม่มีค่า” ออกจาก `0`, `false` และคำตอบ “ไม่เกี่ยวข้อง”
- ใช้ inclusive/exclusive boundaries ให้ตรงข้อกำหนดและระบุในข้อความช่วยเหลือ
- Date/time ต้องระบุ timezone และห้ามเทียบ string หาก format ไม่รับประกันลำดับ
- Cross-field rule ควรชี้ error ไปช่องที่ผู้ใช้แก้ได้
- Conditional field ต้อง required เฉพาะเมื่อเงื่อนไขแสดง/ใช้งานอยู่
- Server ต้อง validate ซ้ำและไม่เชื่อ client input
- Error summary ต้อง focus ได้และแต่ละรายการลิงก์ไป field ที่ผิด
- หลีกเลี่ยง regex ที่ซับซ้อนเกินจำเป็นและห้ามจำกัดชื่อบุคคลให้เป็น ASCII
- เก็บ raw answer กับ derived score แยกกันเพื่อ audit และคำนวณใหม่ได้
