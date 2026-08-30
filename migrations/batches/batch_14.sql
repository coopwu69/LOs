DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิทยาศาสตร์ทางทะเล', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.97, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'หลักสูตรวิทยาศาสตร์ทางทะเล_CLO_สหกิจศึกษา_JR310.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| อธิบายคุณค่าความเป็นมนุษย์ ความหลากหลายทางวัฒนธรรม ปรับตัว และแก้ปัญหาเฉพาะหน้าในสถานการณ์ที่มีการเปลี่ยนแปลงของสังคม-เศรษฐกิจ และสิ่งแวดล้อม', NULLIF('', ''), NULLIF('PLO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| อธิบายองค์ความรู้ด้านวิทยาศาสตร์ คณิตศาสตร์ สถิติ และเทคโนโลยีสารสนเทศ ได้อย่างถูกต้องตามหลักวิชาการ', NULLIF('', ''), NULLIF('PLO2', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| อธิบายหลักการ กระบวนการ การใช้เครื่องมือหรือเทคโนโลยีในภาคสนามและห้องปฏิบัติการ เป็นลำดับขั้นตอนที่ถูกต้องตามหลักวิชาการ', NULLIF('', ''), NULLIF('PLO3', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| ประยุกต์ใช้ความรู้ทางวิทยาศาสตร์เพื่อแก้ปัญหาด้านสิ่งแวดล้อม และทรัพยากรทางทะเลและชายฝั่งได้ถูกต้องตามหลักวิชาการ', NULLIF('', ''), NULLIF('PLO4', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะการคิดวิเคราะห์และวิพากษ์เพื่อแก้ปัญหาด้านสิ่งแวดล้อม และทรัพยากรทางทะเลและชายฝั่ง', NULLIF('', ''), NULLIF('PLO5', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะในการใช้เทคโนโลยีสารสนเทศในการค้นคว้า การจัดเก็บ ประมวลผล และนำเสนอข้อมูลเชิงวิชาการได้อย่างเหมาะสมกับสถานการณ์', NULLIF('', ''), NULLIF('PLO6', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะในการสื่อสารด้วยภาษาไทยและภาษาอังกฤษ เพื่อใช้ในชีวิตประจำวัน และในการทำงานด้านวิทยาศาสตร์ทางทะเล ทั้งการฟัง การพูด การเขียน และนำเสนอผลงานได้ตามวัตถุประสงค์ ในกรณีที่นักศึกษาเลือกภาษาจีนสามารถสื่อสารภาษาจีนในชีวิตประจำวันได้', NULLIF('', ''), NULLIF('PLO7', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะในการใช้อุปกรณ์และเครื่องมือเพื่อเก็บตัวอย่างในภาคสนาม และวิเคราะห์ตัวอย่างในห้องปฏิบัติการที่เกี่ยวข้องกับวิทยาศาสตร์พื้นฐาน และคุณภาพสิ่งแวดล้อมทางทะเลในด้านชีวภาพ กายภาพ และด้านเคมีได้อย่างถูกต้องตามมาตรฐานของห้องปฏิบัติการ', NULLIF('', ''), NULLIF('PLO8', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะในการใช้โปรแกรมประยุกต์ด้านภูมิสารสนเทศ และด้านสถิติเพื่อการจัดการทรัพยากรทางทะเลและชายฝั่ง', NULLIF('', ''), NULLIF('PLO9', ''), 'single_choice'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะการทำงานเป็นทีม ทักษะการเล่นกีฬา และการออกกำลังกายเพื่อการดูแลสุขภาพพื้นฐาน', NULLIF('', ''), NULLIF('PLO10', ''), 'single_choice'::question_type, true, 6)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีจริยธรรมทางวิชาการ มีความซื่อสัตย์ มีความกตัญญู และมีความรับผิดชอบต่อตนเอง ผู้อื่น และสังคม', NULLIF('', ''), NULLIF('PLO11', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| แสดงออกถึงการมีภาวะผู้นำ ผู้ตาม มีจิตอาสาในการทำงาน มีวินัย ปฏิบัติตามกฏระเบียบและกฏหมาย', NULLIF('', ''), NULLIF('PLO12', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;

