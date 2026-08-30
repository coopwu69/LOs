DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'The learning outcomes of cooperative education subject – English Program', NULLIF('Apply knowledge of English to perform tasks in the workplace.', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.91, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'LOs Coop Ed_English_8 Dec 2024.pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้องค์ความรู้ด้านภาษาอังกฤษเพื่อ ระดับดีเยี่ยม (ประยุกต์ใช้ความรู้ภาษาอังกฤษใน ปฏิบัติงานในสถานประกอบการได้ การปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการ Apply knowledge of English to perform tasks ไดอ้ ย่างมปี ระสิทธิภาพ ถูกต้องและเหมาะสม) in the workplace. ระดับดีมาก (ประยุกต์ใช้ความรู้ภาษาอังกฤษใน การปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการ ไดอ้ ย่างมีประสิทธิภาพ แต่ยังมีข้อผิดพลาดบ้าง) ระดับดี (ประยุกต์ใช้ความรู้ภาษาอังกฤษในการ ปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการได้ พอสมควร และยังมีข้อผิดพลาดอยู่บ้าง) ระดับพอใช้ (ประยุกต์ใช้ความรู้ภาษาอังกฤษใน การปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการ ได้เพียงเล็กน้อย และยังมีข้อผิดพลาดเป็นส่วนใหญ่) ระดับควรปรับปรุง (ไม่สามารถประยุกต์ใช้ความรู้ ภาษาอังกฤษในการปฏิบัติงานที่ได้รับมอบหมายใน สถานประกอบการได้)', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้ความรู้เฉพาะด้านในสาขาวิชาชีพที่ ระดับดีเยี่ยม (ประยุกต์ใช้ความรู้เฉพาะด้านใน เกี่ยวข้องกับลักษณะงานในสถานประกอบการได้ การปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการ Apply specialized knowledge in a professional ได้อย่างมีประสิทธิภาพ ถูกต้องและเหมาะสม) field relevant to the specific nature of work in the workplace. ระดับดีมาก (ประยุกต์ใช้ความรู้เฉพาะด้านในการ ประยุกต์ใช้ความรู้เฉพาะด้านในการปฏิบัติงานที่ได้รับ ปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการได้ มอบหมายในสถานประกอบการอย่างมีประสิทธิภาพ อย่างมีประสิทธิภาพ แต่ยังมีข้อผิดพลาดบ้าง) ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน ระดับดี (ประยุกต์ใช้ความรู้เฉพาะด้านในการ ปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการได้ พอสมควร และยังมีข้อผิดพลาดอยู่บ้าง) ระดับพอใช้ (ประยุกต์ใช้ความรู้เฉพาะด้านในการ ปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการได้ เพียงเล็กน้อย และยังมีข้อผิดพลาดเป็นส่วนใหญ่) ระดับควรปรับปรุง (ไม่สามารถประยุกต์ใช้ความรู้ เฉพาะด้านในการปฏิบัติงานที่ได้รับมอบหมายในสถาน ประกอบการได)้', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการสื่อสารภาษาอังกฤษในบริบทของ ระดับดีเยี่ยม (สื่อสารและน าเสนอโดยใช้ การท างาน และการน าเสนอผลงานในที่สาธารณะที่ ภาษาอังกฤษได้อย่างคล่องแคล่ว เนื้อหาครบถ้วน และ เกี่ยวข้องกับการประกอบอาชีพ ตอบค าถามได้ทุกประเด็น) Employ English communication skills in work contexts and public presentations related to ระดับดีมาก (สื่อสารและน าเสนอโดยใช้ professional practice. ภาษาอังกฤษได้อย่างคล่องแคล่ว แต่อาจติดขัดบ้าง เนื้อหาครบถ้วนเป็นส่วนใหญ่ และตอบค าถามได้เกือบ ทุกประเด็น) ระดับดี (สื่อสารและน าเสนอโดยใช้ภาษาอังกฤษ ไดค้ ล่องแคล่วเป็นส่วนใหญ่ เนื้อหาบางส่วนขาด หายไป และตอบค าถามได้บางประเด็น) ระดับพอใช้ (สื่อสารและน าเสนอโดยใช้ ภาษาอังกฤษไม่คล่องแคล่ว เนื้อหาส่วนใหญ่ขาด หายไป และตอบค าถามได้น้อยมาก) ระดับควรปรับปรุง (ไม่สามารถสื่อสารและ น าเสนอโดยใช้ภาษาอังกฤษได้อย่างคล่องแคล่ว เนื้อหาไม่ครบถ้วน และไม่สามารถตอบค าถามได)้ ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการใช้เทคโนโลยียุคดิจิทัล ในการ ระดับดีเยี่ยม (ใช้เทคโนโลยีเพื่อการปฏิบัติงานได้ ค้นคว้าข้อมูล คัดกรอง รวบรวมองค์ความรู้ เพื่อ อย่างมปี ระสิทธิภาพ) ปฏิบัติงานในสถานประกอบการ Utilize digital technology skills for researching, ระดับดีมาก (ใช้เทคโนโลยีเพื่อการปฏิบัติงานได้ filtering, and compiling knowledge to perform อย่างดี) tasks in the workplace. ระดับดี (ใช้เทคโนโลยีเพื่อปฏิบัติงานได้ในประดับ ปานกลาง) ระดับพอใช้ (ใช้เทคโนโลยีเพื่อปฏิบัติงานได้ใน ระดับเบื้องต้น) ระดับควรปรับปรุง (ขาดความรู้ในการใช้ เทคโนโลยีเพื่อปฏิบัติงาน)', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการคิด วิเคราะห์ และการใช้เหตุผล ระดับดีเยี่ยม (มีการคิด วิเคราะห์ หรือใช้เหตุผล เพื่อพัฒนา แก้ปัญหา หรือเพิ่มพูนความรู้ที่เกี่ยวข้อง เพื่อพัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่เกี่ยวข้องกับ กับสถานประกอบการ สถานประกอบการได้ทั้งหมด) Develop skills in critical thinking, analysis, and reasoning to improve, solve problems, or ระดับดีมาก (มีการคิด วิเคราะห์ หรือใช้เหตุผล enhance knowledge related to the เพื่อพัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่เกี่ยวข้องกับ workplace. สถานประกอบการได้เป็นส่วนใหญ่) ระดับดี (มีการคิด วิเคราะห์ หรือใช้เหตุผลเพื่อ พัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่เกี่ยวข้องกับ สถานประกอบการได้พอสมควร) ระดับพอใช้ (มีการคิด วิเคราะห์ หรือใช้เหตุผล เพื่อพัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่เกี่ยวข้องกับ สถานประกอบการไดบ้ ้าง) ระดับควรปรับปรุง (ขาดการคิด วิเคราะห์ หรือใช้ เหตุผลเพื่อพัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่ เกี่ยวข้องกับสถานประกอบการ)', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงความกตัญญู รับผิดชอบ ซื่อสัตย์ ตรงเวลา และไม่ละเมิดจรรยาบรรณทางวิชาการและ วิชาชีพ Express gratitude, responsibility, honesty, punctuality, and commitment to academic and professional ethics.', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงการมีทัศนคติเปิดกว้าง ยอมรับ ความแตกต่างและการเปลี่ยนแปลง มีวินัย สามารถ ปรับตัวและร่วมงานกับผู้อื่นได้ Demonstrate an open-minded attitude, acceptance of differences and changes, discipline, adaptability, and teamwork skills.', NULLIF('', ''), NULLIF('LO7', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;

