DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรสารสนเทศศาสตรบณั ฑิต', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.85, true
  FROM public.assessment_source_documents sd WHERE sd.filename = '4.หลักสูตรดิจิทัลคอนเทนต์และสื่อ.pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': อธิบายความรู้ด้านมนุษยศาสตร์ 5 (ยอดเยี่ยม): บูรณาการความรู้ทุกด้านมาสร้าง สังคมศาสตร์ทั่วไป เทคโนโลยีสารสนเทศพื้นฐาน ดิจิทลั คอนเทนต์ที่ตอบโจทย์ผู้ใช้ได้ นำเสนอแนวคิดได้ และแนวคิดสำหรับการออกแบบ ผลิต และ อย่างครบถ้วนชัดเจน เผยแพร่ดิจิทัลคอนเทนต์ที่ตอบสนองความต้องการ', NULLIF('', ''), NULLIF('PLO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ประยุกต์ใช้ความรู้ได้อย่างเหมาะสม ผลิต ของผู้ใช ้ คอนเทนต์ที่มีคุณภาพดี ตรงความต้องการนผู้ใช้ แต่ยัง ขาดความโดนเด่นด้านนวัตกรรม', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ใชค้ วามรู้พื้นฐานไดถ้ ูกต้อง สร้างคอนเทนต์ได้ ตามมาตรฐาน แต่ยังต้องปรบั ปรุงการตอบสนองความ ต้องการผู้ใช้', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('เข้าใจหลักการพื้นฐาน แต่ประยุกต์ใช้ได้ จำกัด ผลงานยังไม่สมบูรณ์ ต้องได้รับคำแนะนำบ่อยครั้ง', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ขาดความเข้าใจพื้นฐาน ไม่ สามารถนำความรู้มาใช้ได้อย่างเหมาะสม ผลงานไม่ผ่าน เกณฑ์มาตฐาน', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ประยุกต์ใช้ความรู้ด้านการจัดการ 5 (ยอดเยี่ยม): ระบุความต้องการในการดำเนินงาน สารสนเทศ การออกแบบและผลิตสื่อ การ ขององค์กรได้ สามารถออกแบบกระบวนการทำงานที่ จัดบริการดิจิทัลคอนเทนต์ และความรู้ในการ แก้ปัญหาขององค์กร ใช้ความรู้จากรายวิชาเพื่อแก้ปัญหา ประกอบอาชีพด้านการพัฒนาการเรียนแบบ ในการทำงาน สามารถผลิตชนิ้ งานหรือบริการตามที่ได้รับ ออนไลน์ หรือ คอนเทนต์เพื่อการตลาดดิจิทัล หรือ มอบหมาย สรา้ งนวัตกรรมด้านบริหารให้กับองค์กร ดิจิทัลคอลเล็กชัน หรือ เทคโนโลยีเพื่อการจัดการ', NULLIF('', ''), NULLIF('PLO2', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ระบุความต้องการในการดำเนินงานของ คอนเทนต์ เพื่อตอบสนองความต้องการของ ผู้ประกอบการในอุตสาหกรรมดิจิทัล องค์กรได้ สามารถออกแบบกระบวนการทำงานที่ แก้ปัญหาขององค์กร ใช้ความรู้จากรายวิชาเพื่อแก้ปัญหา ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ ในการทำงาน สามารถผลิตชนิ้ งานหรือบริการตามที่ได้รับ มอบหมาย', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ระบุความต้องการในการดำเนินงานของ องค์กรได้ สามารถออกแบบกระบวนการทำงานที่ แก้ปัญหาขององค์กร ใช้ความรู้จากรายวิชาเพื่อแก้ปัญหา ในการทำงาน', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ระบุความต้องการในการดำเนินงานของ องค์กรได้ สามารถออกแบบกระบวนการทำงานที่ แก้ปัญหาขององค์กร', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ระบุความต้องการในการ ดำเนินงานขององค์กรได้ (2)', ''), 1, 4);
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': เลือกใช้เทคโนโลยีเพื่อการพัฒนาดิจิทัล 5 (ยอดเยี่ยม): สามารถใช้งานโปรแกรมหรือ คอนเทนต์ที่ตอบสนองวัตถุประสงค์การใช้งานของ เทคโนโลยเี พื่อการพัฒนาดิจิทัลคอนเทนต์ได้อย่าง ผู้ใช้ สร้างสรรค์ สอดคล้องตามวัตถุประสงค์การใช้งานอย่าง ถูกต้องและมีประสิทธิภาพ', NULLIF('', ''), NULLIF('PLO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('เลือกใช้งานโปรแกรมหรือเทคโนโลยีเพื่อ การพัฒนาดิจิทัลคอนเทนต์ได้ดี สอดคล้องตาม วัตถุประสงค์การใช้งาน สามารถปรบั ปรุงบางส่วนเพื่อเพิ่ม ประสิทธิภาพได้ดี', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('เลอื กใช้งานโปรแกรมหรือเทคโนโลยีเพื่อการ พัฒนาดิจิทัลคอนเทนต์ได ้ ตอบโจทย์วัตถุประสงค์ได้เพียง บางส่วน มีความคิดสร้างสรรค์ในระดับพื้นฐานและ แก้ปัญหาได้เพียงบางกรณี ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('เลือกใช้งานโปรแกรมหรือเทคโนโลยีเพื่อ การพัฒนาดิจิทัลคอนเทนต์ไดเ้ ป็นบางงาน ทำให้เกิด ข้อจำกัดในการทำงาน ขาดความคิดสร้างสรรค์และการ แก้ปัญหาที่เหมาะสม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่เลอื กใช้งานโปรแกรมหรือ เทคโนโลยีเพื่อการพัฒนาดิจิทัลคอนเทนต์ได้ ขาด ความคิดสร้างสรรค์และการแก้ปัญหาที่เหมาะสม', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ออกแบบการจัดบริการดิจิทัลคอนเทนต์อ 5 (ยอดเยี่ยม): ออกแบบบรกิ ารนดิจิทัลคอนเทนต ์ ย่างเป็นระบบ โดยใช้กระบวนการวิจัยและพัฒนา อย่างเป็นระบบครบถ้วน เพื่อรองรับการเปลี่ยนแปลงทางดิจิทัลขององค์กร', NULLIF('', ''), NULLIF('PLO4', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ออกแบบบรกิ ารนดิจิทัลคอนเทนต ์ อย่าง เป็นระบบ', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ออกแบบบริการได้อย่างมีโครงสร้างพื้นฐานที่ ชัดเจน', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ออกแบบได้ในระดับพื้นฐาน แต่ขาดความ เป็นระบบ', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไมส่ ามารถออกแบบบริการดิจิทัล คอนเทนต์ได ้', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะในการจัดระบบบริการดิจิทัลคอน 5 (ยอดเยี่ยม): สามารถจัดระบบบริการได้อย่าง เทนต์ให้สอดคล้องกับความต้องการขององค์กร สมบูรณ์และเป็นระบบ สอดคล้องกับความต้องการของ องค์กรอย่างชัดเจน พร้อมทงั้ มีความสามารถในการ ปรับปรุงระบบให้เหมาะสมกบั บริบทที่เปลยี่ นแปลง', NULLIF('', ''), NULLIF('PLO5', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('สามารถจัดระบบบริการได้อย่างสมบรู ณ์ และเป็นระบบ และครอบคลุมสอดคล้องกับความต้องการ ขององค์กรได้ในระดับที่ด ี ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('สามารถจัดระบบบริการได้อย่างมีโครงสร้างส พื้นฐาน สอดคล้องกับความต้องการขององค์กรในบางส่วน แต่ยังมีจุดที่ต้องปรับปรุง', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('สามารถจัดระบบบริการได้ในระดับ เบื้องต้น แต่ยังขาดความสอดคล้องกับความต้องการของ องค์กร', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไมม่ ีความสามารถในการจัดระบบ บริการดิจิทลั คอนเทนต์ได้อย่างเหมาะสม', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการสื่อสารภาษาไทยและ 5 (ยอดเยี่ยม): มีทักษะการสื่อสารภาษาไทยและ ภาษาอังกฤษ เพื่อใช้ในชีวิตประจำวัน ทั้งการฟัง ภาษาอังกฤษที่โดดเด่น สื่อสารได้อย่างคล่องแคล่ว พูด อ่าน เขียน และเสนอผลงานได้ตาม ถูกต้อง และมปี ระสิทธิภาพในทุกสถานการณ์ประจำวัน วัตถุประสงค์ ในกรณีที่นักศึกษาเลือกภาษาจีน', NULLIF('', ''), NULLIF('PLO6', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('มีทักษะการสอื่ สารภาษาไทยได้อย่าง สามารถสื่อสารภาษาจีนในชีวิตประจำวันได ้ ถูกต้อง สามารถสื่อสารภาษาอังกฤษได้ในระดับดี ทั้งการ ฟัง พูด อ่าน เขียน ในสถานการณ์ประจำวัน', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('มีทักษะการสื่อสารภาษาไทยที่ดี และ สามารถใช้ภาษาอังกฤเพื่อการฟัง พูด อ่าน เขียนใน ระดับพื้นฐาน สื่อสารภาษาอังกฤษได้ในสถานการณ์ทั่วไป แต่ยังมีข้อผิดพลาดในโครงสร้างหรือการเลือกใช้คำ', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('สามารถสื่อสารภาษาไทยได้ใน ระดับพื้นฐาน การใช้ภาษาองั กฤษยังมีข้อจำกัด เช่น การ สื่อสารคำศัพทง์ ่ายๆ เท่านั้น', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ขาดทักษะในการฟงั พูด อ่าน เขียน ทั้งภาษาไทยและภาษาอังกฤษณ ไม่สามารถสื่อสาร ในสถานการณป์ ระจำวันได้ ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ (3)', ''), 1, 4);
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงความซื่อสัตย์ ความกตัญญู 5 (ยอดเยี่ยม): ปฏิบัติงานด้วยความซื่อสตั ย์สุจริต กตเวที ความรับผิดชอบต่อตนเองและสังคม ปฏิบัติ แสดงจิตอาสาและช่วยเหลืองานขององค์กร รับผิดชอบ ตามกฎระเบียบ และปฏิบัติตนอย่างถูกต้องตาม งานให้แล้วเสรจ็ ตรงเวลา แก้ปัญหาในการทำงานได้ด้วย จริยธรรมทางวิชาการ ตนเอง ปฏิบัติตามกฎระเบียบขององค์กร', NULLIF('', ''), NULLIF('PLO7', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ปฏิบัติงานด้วยความซื่อสตั ยส์ ุจริต แสดง จิตอาสาและช่วยเหลืองานขององค์กร รับผิดชอบงานให้ แล้วเสร็จตรงเวลา แก้ปัญหาในการทำงานได้ด้วยตนเอง', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ปฏิบัติงานด้วยความซื่อสตั ย์สุจริต แสดงจิต อาสาและช่วยเหลืองานขององค์กร รับผิดชอบงานให้แล้ว เสร็จตรงเวลา', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ปฏิบัติงานด้วยความซื่อสตั ยส์ ุจริต แสดง จิตอาสาและช่วยเหลืองานขององค์กร', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ปฏิบัติงานด้วยความซื่อสตั ย์สุจริต (4)', ''), 1, 4);
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการมีภาวะผู้นำ มีสุขภาวะ 5 (ยอดเยี่ยม): แสดงความเป็นผู้นำได้อย่างชัดเจนใน สามารถเป็นได้ทั้งผู้นำและผู้ตาม มีจิตอาสาและ ทุกสถานการ์ มีการตัดสินใจอย่างเหมาะสม และสร้าง ทำงานร่วมกับผู้อื่น แรงจูงใจให้กับทีม', NULLIF('', ''), NULLIF('PLO8', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('มีความสามารถในการเป็นผนู้ ำได้ดีใน สถานการณ์ส่วนใหญ่ แต่ยังมจี ุดที่ต้องพัฒนา', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('แสดงบทบามผู้นำได้ในบางสถานการณ์ แต่ ยังขาดความมั่นใจหรือประสทิ ธิภาพ ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('มีความยากลำบากในการแสดงบทบาท ผู้นำ และต้องการคำแนะนำเพิ่มเติม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไมส่ ามารถแสดงบทบาทผู้นำได้ หรือหลีกเลี่ยงการรับผิดชอบ', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการรู้ดิจิทัล สามารถแสวงหา 5 (ยอดเยี่ยม): สามารถค้นหาและเข้าถูกข้อมูลได้ ความรู้ภายใต้สภาพแวดล้อมดิจิทัล อย่างรวดเร็วและมีประสิทธิภาพ โดยใช้เครื่องมือดิจิทัลที่ หลากหลาย', NULLIF('', ''), NULLIF('PLO9', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ค้นหาและเขา้ ถึงข้อมูลได้ดี โดยใช้ เครื่องมือมที่เหมาะสม', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ด', NULLIF('', ''), NULLIF('ี : สามารถค้นหาข้อมูลได้ในระดับพื้นฐาน แต่ ต้องการคำแนะนำเพิ่มเติม', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('มีความยากลำบากในการค้นหาข้อมูลและ ใช้งานเครื่องมือได้อย่างจำกัด', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรงุ', NULLIF('', ''), NULLIF('ไมส่ ามารถค้นหาและเข้าถึงข้อมูล ได้ด้วยตนเอง', ''), 1, 4);
END $$;

