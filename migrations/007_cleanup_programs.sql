-- Cleanup: align active program counts with source folders
-- - inactivate old programs that have no source document or are duplicates
-- - rename DFB to the user's requested name
-- - reassign agriculture source docs from AGRI to FSI/ANSCI

BEGIN;

-- 1. Inactivate old/duplicate programs
UPDATE public.programs
SET is_active = false
WHERE (school = 'สำนักวิชารัฐศาสตร์และรัฐประศาสนศาสตร์' AND code = 'ASEAN')
   OR (school = 'สำนักวิชาวิทยาศาสตร์' AND code IN ('BIO', 'CHEM', 'MATH', 'PHYS'))
   OR (school = 'สำนักวิชาวิศวกรรมศาสตร์และเทคโนโลยี' AND code = 'SE')
   OR (school = 'สำนักวิชาสาธารณสุขศาสตร์' AND code = 'PH')
   OR (school = 'สำนักวิชาการจัดการ' AND code = 'SRV')
   OR (school = 'สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร' AND code = 'AGRI');

-- 2. Rename DFB to the correct curriculum name
UPDATE public.programs
SET name_th = 'หลักสูตรการจัดการธุรกิจและการเงินยุคดิจิทัล'
WHERE school = 'สำนักวิชาการบัญชีและการเงิน' AND code = 'DFB';

-- 4. Rename DMI to DTM to match dataset/seed files
UPDATE public.programs
SET code = 'DTM', slug = 'dtm'
WHERE school = 'สำนักวิชาสารสนเทศศาสตร์' AND code = 'DMI';

-- 3. Reassign agriculture source documents from AGRI to FSI / ANSCI
UPDATE public.assessment_source_documents
SET program_id = (
  SELECT id FROM public.programs
  WHERE school = 'สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร' AND code = 'FSI'
)
WHERE filename = 'PLOs-หลักสูตรวิทยาศาสตรบัณฑิต-สาขาวิทยาศาสต.docx'
  AND program_id = (
    SELECT id FROM public.programs
    WHERE school = 'สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร' AND code = 'AGRI'
  );

UPDATE public.assessment_source_documents
SET program_id = (
  SELECT id FROM public.programs
  WHERE school = 'สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร' AND code = 'ANSCI'
)
WHERE filename = 'หัวข้อประเมินตาม PLOs เกษตรศาสตร์และนวัตกรร.docx'
  AND program_id = (
    SELECT id FROM public.programs
    WHERE school = 'สำนักวิชาเทคโนโลยีการเกษตรและอุตสาหกรรมอาหาร' AND code = 'AGRI'
  );

COMMIT;
