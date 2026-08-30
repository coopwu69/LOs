DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรรัฐศาสตรบัณฑิต สาขาความสัมพันธ์ระหว่างประเทศ', '3 = ดี (Good)', 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.78, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'LO และแบบสอบถาม - หลักสูตรรัฐศาสตร์ IR 2567.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'Section 1', NULL, 'general'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 ใช้ความรู้พื้นฐาน/แนวคิดด้านความสัมพันธ์ระหว่างประเทศในการพัฒนาหรือแก้ไขปัญหาในสถานประกอบการได้ (Applies fundamental IR knowledge or concepts to improve or solve organizational work processes effectively.)', NULL, NULL, 'rating_scale'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 ใช้กระบวนการคิดวิเคราะห์และความคิดสร้างสรรค์ เพื่อระบุและวิเคราะห์ปัญหา พร้อมเสนอแนวทางแก้ไขอย่างเป็นระบบ (Employs analytical and creative thinking to identify and analyze problems and propose systematic solutions.)', NULL, NULL, 'rating_scale'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '3 ทันต่อเหตุการณ์/ข่าวสารที่เกี่ยวข้องกับวิชาชีพและสถานการณ์ปัจจุบัน มีความสามารถในการสืบค้นข้อมูลเชิงวิชาการ (Keeps up-to-date with news and information relevant to the profession and current affairs, and demonstrates the ability to research for academic resources.)', NULL, NULL, 'rating_scale'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '4 สรุปผลการปฏิบัติงานสหกิจศึกษา และนำเสนอผลงานได้ตามมาตรฐานทางวิชาการ พร้อมเชื่อมโยงประสบการณ์สู่การวางแผนประกอบอาชีพ/การพัฒนาต่อยอด (Summarizes co-op work results and presents them according to academic standards, linking experiences to future career planning or further development.)', NULL, NULL, 'rating_scale'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 ติดต่อสื่อสาร (ฟัง พูด อ่าน เขียน) ทั้งภาษาไทย ภาษาอังกฤษ และ/หรือภาษาที่สามได้อย่างเหมาะสม โดยคำนึงถึงความแตกต่างทางวัฒนธรรม (Communicates effectively (listening, speaking, reading, writing) in Thai, English, and/or a third language, considering cultural differences.)', NULL, NULL, 'rating_scale'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 ใช้เทคโนโลยีสารสนเทศในการสืบค้น จัดเก็บ วิเคราะห์ข้อมูล จัดทำรายงานได้อย่างถูกต้อง พร้อมตระหนักถึงความปลอดภัยไซเบอร์ (Utilizes IT skills to search, store, and analyze data, preparing accurate reports while ensuring cybersecurity awareness.)', NULL, NULL, 'rating_scale'::question_type, true, 6)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '3 วางแผนและปฏิบัติงานในโครงการหรือหน้าที่ที่ได้รับมอบหมายได้อย่างต่อเนื่อง มีความสามารถในการจัดการปัญหา/อุปสรรคได้อย่างเหมาะสมและปรับตัวได้ดี (Plans and carries out assigned projects or tasks continuously, effectively resolves issues, and adapts well to changes.)', NULL, NULL, 'rating_scale'::question_type, true, 7)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 รับผิดชอบต่อหน้าที่ มีความซื่อสัตย์สุจริต และเคารพกฎระเบียบขององค์กร (Demonstrates responsibility, honesty, and respects organizational rules.)', NULL, NULL, 'rating_scale'::question_type, true, 8)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 ปฏิบัติงานโดยยึดจรรยาบรรณทางวิชาชีพ (Adheres to the professional code of ethics in all tasks.)', NULL, NULL, 'rating_scale'::question_type, true, 9)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '3 มีวินัย ตรงต่อเวลา และตระหนักในบทบาทหน้าที่ของตน (Maintains discipline, punctuality, and awareness of one’s responsibilities.)', NULL, NULL, 'rating_scale'::question_type, true, 10)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '4 เคารพสิทธิและความคิดเห็นที่หลากหลาย (Respects others’ rights and diverse opinions with an open mind.)', NULL, NULL, 'rating_scale'::question_type, true, 11)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 ทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพ ร่วมมือกับทีม มีวินัย และแสดงทัศนคติเปิดกว้างแบบพลเมืองโลก (Works effectively in a team, maintains discipline, and shows a global citizen attitude.)', NULL, NULL, 'rating_scale'::question_type, true, 12)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 แสดงออกถึงจิตอาสาในการช่วยเหลือสังคม และให้ความร่วมมือกับกิจกรรมส่วนรวม (Demonstrates volunteer spirit, actively contributing to the community and group activities.)', NULL, NULL, 'rating_scale'::question_type, true, 13)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '3 มีความอดทน ยืดหยุ่น บริหารเวลาได้ดี และสามารถทำงานภายใต้สภาวะกดดัน (Shows resilience and flexibility, manages time well, and performs under pressure.)', NULL, NULL, 'rating_scale'::question_type, true, 14)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '4 ใช้ความคิดสร้างสรรค์ และมี ทัศนคติเชิงบวกในการเรียนรู้สิ่งใหม่ เพื่อนำมาพัฒนาตนเองอย่างต่อเนื่อง (Applies creativity and maintains a positive attitude toward lifelong learning for continuous self-improvement.)', NULL, NULL, 'rating_scale'::question_type, true, 15)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรรัฐประศาสนศาสตรบัณฑิต', '3 = ดี (Good)', 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.68, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'แบบประเมินสหกิจหลักสูตร รปศ.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'Section 1', NULL, 'general'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 การนำหลักการและทฤษฎีรัฐประศาสนศาสตร์ไปปรับใช้กับการปฏิบัติงานในสถานประกอบการ (Be able to apply public administration principles and theories to workplace practices.) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 ใช้กระบวนการคิดวิเคราะห์และความคิดสร้างสรรค์ เพื่อระบุและวิเคราะห์ปัญหาพร้อมเสนอแนวทางแก้ไขอย่างเป็น ระบบ (Employs analytical and creative thinking to identify and analyze problems and propose systematic solutions.) |  |  |  |  | หัวข้อที่ 2: ทักษะ (Skills) (สอดคล้องกับ CLO2, CLO3) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 สามารถใช้เครื่องมือเทคโนโลยีสารสนเทศ ในการสืบค้น วิเคราะห์ และรายงานข้อมูลที่เกี่ยวข้องกับการปฏิบัติงานได้อย่างมีประสิทธิภาพ (The ability to use information technology tools to search, analyze, and effectively report work-related data.) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 สามารถนำผลการวิจัยหรือการวิเคราะห์ข้อมูล เพื่อเสนอแนะแนวทางแก้ไขปัญหา หรือปรับปรุงงานในสถานประกอบการได้อย่างเหมาะสม (The ability to apply research findings or data analysis to propose solutions or improve workplace operations appropriately.) |  |  |  |  | หัวข้อที่ 3: จริยธรรม (Ethics) (สอดคล้องกับ CLO4, CLO5) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 แสดงออกมีความซื่อสัตย์สุจริต ในการปฏิบัติงานของสถานประกอบการ (Demonstrates integrity and honesty in workplace practices.) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 แสดงออกถึงความมีวินัยและปฏิบัติตามกฎระเบียบของสถานประกอบการ (Exhibits discipline and adherence to the organization''s rules and regulations.) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 6)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '3 สามารถรับผิดชอบต่องานที่ได้รับมอบหมาย และส่งมอบงานได้ตามกำหนดเวลา (The ability to take responsibility for assigned tasks and deliver work within the specified timeframe.) |  |  |  |  | หัวข้อที่ 4: ลักษณะบุคคล (Character) (สอดคล้องกับ CLO6, CLO7) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 7)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '1 แสดงออกถึงความพยายามในการเรียนรู้สิ่งใหม่ เพื่อพัฒนาความรู้และทักษะที่เกี่ยวข้องกับงานที่ได้รับมอบหมาย (Shows effort in learning new things to enhance knowledge and skills related to assigned tasks.) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 8)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '2 แสดงออกถึงลักษณะของความเป็นผู้นำในการทำงานร่วมกับบุคลากรของสถานประกอบการ (Demonstrates leadership qualities in working collaboratively with organizational personnel.) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 9)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '3 มีความคิดริเริ่มสร้างสรรค์ ในการแก้ปัญหาหรือปรับปรุงกระบวนการทำงานของสถานประกอบการ (Demonstrates leadership qualities in working collaboratively with organizational personnel.) |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 10)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '4 แสดงออกถึง จิตอาสาและความกระตือรือร้นในการช่วยเหลือผู้อื่นหรือสนับสนุนกิจกรรมของสถานประกอบการ (Exhibits volunteer spirit and enthusiasm in helping others or supporting organizational activities.) |  |  |  |  | ผลการปฏิบัติงานโดยภาพรวม |  |  |  |  |', NULL, NULL, 'single_choice'::question_type, true, 11)
  RETURNING id INTO q_id;
END $$;

