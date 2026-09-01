---
name: survey-analytics
description: วิเคราะห์คุณภาพคำตอบ missing data และคะแนนแบบสอบถามโดยไม่ตีความเกินหลักฐาน
argument-hint: "<ชุดข้อมูล รายงาน หรือสูตรคะแนน>"
triggers:
  - user
  - model
---

# Survey Analytics

1. ตรวจ codebook, population, sampling, scoring version และช่วงเวลาเก็บข้อมูล
2. ประเมินคุณภาพคำตอบตาม `response-quality.md` โดยใช้หลายสัญญาณและไม่ลบข้อมูลอัตโนมัติ
3. วิเคราะห์ missingness ตาม `missing-data.md` แยก missing ทุกประเภท
4. คำนวณและรายงานคะแนนตาม `scoring.md`
5. รายงาน denominator, sample size, uncertainty, exclusions และ limitations เสมอ
6. ปกป้องข้อมูลส่วนบุคคลและไม่แสดงกลุ่มย่อยที่เสี่ยงระบุตัวบุคคล

ผลลัพธ์ต้องแยก descriptive findings, quality flags, assumptions และข้อสรุปที่รองรับด้วยหลักฐาน
