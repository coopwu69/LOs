-- Rename ANSCI to match the official curriculum title in its source document
-- ("หัวข้อประเมินตาม PLOs เกษตรศาสตร์และนวัตกรร.docx" titles the curriculum
-- "หลักสูตรเกษตรศาสตร์และนวัตกรรม" with no "(สัตวศาสตร์)" qualifier).

BEGIN;

UPDATE public.programs
SET name_th = 'เกษตรศาสตร์และนวัตกรรม'
WHERE school = 'สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร' AND code = 'ANSCI';

COMMIT;
