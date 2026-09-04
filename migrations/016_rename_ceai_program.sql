-- Rename CEAI to match the official curriculum title in its source
-- document and its own already-created evaluation_templates.title
-- ("ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์
-- พ.ศ.67.docx" titles the curriculum "หลักสูตรวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์",
-- not "วิศวกรรมคอมพิวเตอร์และระบบอัจฉริยะ").

BEGIN;

UPDATE public.programs
SET name_th = 'วิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์'
WHERE school = 'สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี' AND code = 'CEAI';

COMMIT;
