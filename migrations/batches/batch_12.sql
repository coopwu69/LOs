DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรรัฐประศาสนศาสตรบัณฑิต', NULLIF('3 = ดี (Good)', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.68, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'แบบประเมินสหกิจหลักสูตร รปศ.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: Section 1
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'Section 1', NULLIF('', ''), 'general'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 การนำหลักการและทฤษฎีรัฐประศาสนศาสตร์ไปปรับใช้กับการปฏิบัติงานในสถานประกอบการ (Be able to apply public administration principles and theories to workplace practices.) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 ใช้กระบวนการคิดวิเคราะห์และความคิดสร้างสรรค์ เพื่อระบุและวิเคราะห์ปัญหาพร้อมเสนอแนวทางแก้ไขอย่างเป็น ระบบ (Employs analytical and creative thinking to identify and analyze problems and propose systematic solutions.) |  |  |  |  | หัวข้อที่ 2: ทักษะ (Skills) (สอดคล้องกับ CLO2, CLO3) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 สามารถใช้เครื่องมือเทคโนโลยีสารสนเทศ ในการสืบค้น วิเคราะห์ และรายงานข้อมูลที่เกี่ยวข้องกับการปฏิบัติงานได้อย่างมีประสิทธิภาพ (The ability to use information technology tools to search, analyze, and effectively report work-related data.) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 สามารถนำผลการวิจัยหรือการวิเคราะห์ข้อมูล เพื่อเสนอแนะแนวทางแก้ไขปัญหา หรือปรับปรุงงานในสถานประกอบการได้อย่างเหมาะสม (The ability to apply research findings or data analysis to propose solutions or improve workplace operations appropriately.) |  |  |  |  | หัวข้อที่ 3: จริยธรรม (Ethics) (สอดคล้องกับ CLO4, CLO5) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 แสดงออกมีความซื่อสัตย์สุจริต ในการปฏิบัติงานของสถานประกอบการ (Demonstrates integrity and honesty in workplace practices.) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 แสดงออกถึงความมีวินัยและปฏิบัติตามกฎระเบียบของสถานประกอบการ (Exhibits discipline and adherence to the organization''s rules and regulations.) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 6)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '3 สามารถรับผิดชอบต่องานที่ได้รับมอบหมาย และส่งมอบงานได้ตามกำหนดเวลา (The ability to take responsibility for assigned tasks and deliver work within the specified timeframe.) |  |  |  |  | หัวข้อที่ 4: ลักษณะบุคคล (Character) (สอดคล้องกับ CLO6, CLO7) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 7)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 แสดงออกถึงความพยายามในการเรียนรู้สิ่งใหม่ เพื่อพัฒนาความรู้และทักษะที่เกี่ยวข้องกับงานที่ได้รับมอบหมาย (Shows effort in learning new things to enhance knowledge and skills related to assigned tasks.) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 8)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 แสดงออกถึงลักษณะของความเป็นผู้นำในการทำงานร่วมกับบุคลากรของสถานประกอบการ (Demonstrates leadership qualities in working collaboratively with organizational personnel.) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 9)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '3 มีความคิดริเริ่มสร้างสรรค์ ในการแก้ปัญหาหรือปรับปรุงกระบวนการทำงานของสถานประกอบการ (Demonstrates leadership qualities in working collaboratively with organizational personnel.) |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 10)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '4 แสดงออกถึง จิตอาสาและความกระตือรือร้นในการช่วยเหลือผู้อื่นหรือสนับสนุนกิจกรรมของสถานประกอบการ (Exhibits volunteer spirit and enthusiasm in helping others or supporting organizational activities.) |  |  |  |  | ผลการปฏิบัติงานโดยภาพรวม |  |  |  |  |', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 11)
  RETURNING id INTO q_id;
END $$;

