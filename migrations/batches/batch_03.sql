DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรเศรษฐศาสตรบัณฑิต', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'LO สหกิจหลักสูตรเศรษฐศาสตรบัณฑิต.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ในการปฏิบัติงานในองค์กรอย่างเหมาะสม โดยคำนึงถึงบริบทของสถานประกอบการและสถานการณ์จริง | 5 (ยอดเยี่ยม): ประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ได้อย่างถูกต้อง สอดคล้องกับสถานการณ์จริง และมีการเสนอแนะแนวทางแก้ปัญหาที่สร้างสรรค์', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ได้อย่างถูกต้องและเหมาะสมในสถานการณ์ส่วนใหญ่ พร้อมมีข้อเสนอที่ดี', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ในงานที่ได้รับมอบหมายได้ดีในระดับพื้นฐาน', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ประยุกต์ใช้ความรู้ได้บางส่วน แต่ขาดความสมบูรณ์หรือความเหมาะสมในบางกรณี', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ในงานได้อย่างเหมาะสม (2)', ''), 1, 4);
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้เทคโนโลยีและวิทยาการข้อมูล (Data Science) ในการวิเคราะห์ข้อมูลและสนับสนุนกระบวนการทำงานในสถานประกอบการได้อย่างมีประสิทธิภาพ | 5 (ยอดเยี่ยม): ใช้เทคโนโลยีและเครื่องมือ Data Science ในการวิเคราะห์ข้อมูลได้อย่างแม่นยำ ครบถ้วน และมีประสิทธิภาพ', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ใช้เทคโนโลยีและเครื่องมือได้อย่างถูกต้องและมีประสิทธิภาพในส่วนใหญ่', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ใช้เทคโนโลยีและเครื่องมือได้ในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดเล็กน้อย', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ใช้เทคโนโลยีได้ในบางกรณี แต่ยังมีข้อผิดพลาดชัดเจน', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถใช้เทคโนโลยีหรือเครื่องมือได้อย่างถูกต้อง', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้กระบวนการวิจัยเพื่อวิเคราะห์ สังเคราะห์ และนำเสนอข้อมูลในฐานะนักเศรษฐศาสตร์ได้อย่างเป็นระบบ เพื่อตอบโจทย์งานที่ได้รับมอบหมายและจัดทำรายงานสหกิจศึกษาที่สมบูรณ์ | 5 (ยอดเยี่ยม): ใช้กระบวนการวิจัยได้ครบถ้วน สอดคล้องกับเป้าหมาย และจัดทำรายงานที่มีคุณภาพสูง', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ใช้กระบวนการวิจัยได้ดีในส่วนใหญ่ และจัดทำรายงานที่ชัดเจน', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ใช้กระบวนการวิจัยในระดับพื้นฐานและจัดทำรายงานที่เข้าใจได้', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ใช้กระบวนการวิจัยได้เพียงบางส่วน และรายงานขาดความสมบูรณ์', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถใช้กระบวนการวิจัยหรือจัดทำรายงานได้อย่างเหมาะสม', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารและประสานงานกับเพื่อนร่วมงานและบุคลากรในสถานประกอบการ ทั้งภาษาไทยและภาษาอังกฤษได้อย่างมีประสิทธิภาพเพื่อบรรลุเป้าหมายของงาน | 5 (ยอดเยี่ยม): สื่อสารภาษาไทยและภาษาอังกฤษได้อย่างมืออาชีพ ชัดเจน และเหมาะสมกับบริบท', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('สื่อสารภาษาไทยและภาษาอังกฤษได้ดีในสถานการณ์ส่วนใหญ่', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('สื่อสารได้ในระดับพื้นฐาน แต่ยังมีจุดที่ต้องปรับปรุง', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('สื่อสารได้บ้าง แต่มีข้อผิดพลาดที่ทำให้เกิดความไม่ชัดเจน', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถสื่อสารได้อย่างเหมาะสม', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปรับตัวและรับมือกับการเปลี่ยนแปลงในสถานประกอบการ เช่น สภาพแวดล้อมการทำงาน หรือวัฒนธรรมองค์กรได้อย่างเหมาะสม | 5 (ยอดเยี่ยม): ปรับตัวและรับมือกับการเปลี่ยนแปลงในสถานประกอบการได้อย่างมีประสิทธิภาพ พร้อมเสนอแนวทางแก้ไขที่เหมาะสม', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ปรับตัวได้ดีในสถานการณ์ส่วนใหญ่', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ปรับตัวได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางกรณี', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ปรับตัวได้บางส่วน แต่ยังขาดความยืดหยุ่นหรือการตอบสนองที่เหมาะสม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถปรับตัวได้เมื่อเกิดการเปลี่ยนแปลง (3)', ''), 1, 4);
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบและคำนึงถึงจริยธรรม | 5 (ยอดเยี่ยม): แสดงออกถึงความรับผิดชอบและจริยธรรมในวิชาชีพได้อย่างชัดเจนในทุกสถานการณ์', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('แสดงความรับผิดชอบและจริยธรรมในสถานการณ์ส่วนใหญ่', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ปฏิบัติงานด้วยจริยธรรมในระดับพื้นฐาน', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('แสดงความรับผิดชอบได้บางส่วน แต่ยังมีข้อบกพร่อง', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ขาดความรับผิดชอบหรือไม่คำนึงถึงจริยธรรม', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติตามระเบียบและวัฒนธรรมองค์กร | 5 (ยอดเยี่ยม): ปฏิบัติตามระเบียบและวัฒนธรรมองค์กรได้อย่างเคร่งครัดและเป็นแบบอย่างที่ดี', NULLIF('', ''), NULLIF('LO7', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ปฏิบัติตามระเบียบได้ในสถานการณ์ส่วนใหญ่', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ปฏิบัติตามระเบียบในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดเล็กน้อย', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ปฏิบัติตามได้บางส่วน แต่ยังไม่ครบถ้วน', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่ปฏิบัติตามระเบียบหรือขาดความเข้าใจในวัฒนธรรมองค์กร (4)', ''), 1, 4);
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพทั้งในฐานะผู้นำและผู้ตาม พร้อมแสดงออกถึงความคิดสร้างสรรค์และข้อเสนอแนะที่เป็นประโยชน์ต่อองค์กร | 5 (ยอดเยี่ยม): ทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพทั้งในฐานะผู้นำและผู้ตาม พร้อมเสนอแนะที่เป็นประโยชน์', NULLIF('', ''), NULLIF('LO8', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ทำงานร่วมกับผู้อื่นได้ดีในสถานการณ์ส่วนใหญ่', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ทำงานร่วมกับผู้อื่นในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางจุด', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ทำงานร่วมกับผู้อื่นได้บางส่วน แต่มีความขัดแย้งหรือการสื่อสารที่ไม่ชัดเจน', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถทำงานร่วมกับผู้อื่นได้อย่างเหมาะสม', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถพัฒนาตนเอง เรียนรู้อย่างต่อเนื่อง และเตรียมความพร้อมเพื่อก้าวเข้าสู่วิชาชีพในอนาคต | 5 (ยอดเยี่ยม): แสดงความกระตือรือร้นในการพัฒนาตนเองและเรียนรู้อย่างต่อเนื่อง พร้อมนำความรู้ใหม่ไปประยุกต์ใช้', NULLIF('', ''), NULLIF('LO9', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('แสดงความตั้งใจในการเรียนรู้และพัฒนาตนเองในสถานการณ์ส่วนใหญ่', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('มีการพัฒนาตนเองในระดับพื้นฐาน แต่ยังขาดความสม่ำเสมอ', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('มีความพยายามพัฒนาตนเองเพียงบางส่วน', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ขาดความกระตือรือร้นในการเรียนรู้หรือพัฒนาตนเอง', ''), 1, 4);
END $$;

