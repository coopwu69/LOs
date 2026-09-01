---
name: survey-design
description: ออกแบบแบบสอบถาม Likert, matrix, semantic differential, NPS และ assessment อย่างถูกหลักการวัด
argument-hint: "<ประเภทแบบสำรวจหรือ construct ที่ต้องการวัด>"
triggers:
  - user
  - model
---

# Survey Design

ออกแบบแบบสำรวจโดยเริ่มจาก construct และการใช้ผลลัพธ์ ไม่เริ่มจากรูปแบบหน้าจอ

1. นิยาม construct และตัวชี้วัดที่สังเกตได้
2. เลือกรูปแบบจาก `likert.md`, `matrix.md`, `semantic-differential.md`, `nps.md` หรือ `assessment.md`
3. เขียนหนึ่งข้อให้วัดหนึ่ง construct ด้วยภาษากลางและเข้าใจง่าย
4. กำหนด scale anchors, ทิศทางคะแนน, missing value และ “ไม่เกี่ยวข้อง” ก่อนใช้งาน
5. ตรวจ content validity, cognitive load, accessibility และความเหมาะสมกับมือถือ
6. แนะนำ pilot test ก่อนเก็บจริง และห้ามอ้างว่าแบบวัด valid/reliable หากยังไม่มีหลักฐาน

ผลลัพธ์ต้องให้รายการคำถาม, response options, scoring specification, missing-data policy และเหตุผลของการออกแบบ
