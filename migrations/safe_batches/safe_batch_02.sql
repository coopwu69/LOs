DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรเศรษฐศาสตรบัณฑิต', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'LO สหกิจหลักสูตรเศรษฐศาสตรบัณฑิต.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ในการปฏิบัติงานในองค์กรอย่างเหมาะสม โดยคำนึงถึงบริบทของสถานประกอบการและสถานการณ์จริง | 5 (ยอดเยี่ยม): ประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ได้อย่างถูกต้อง สอดคล้องกับสถานการณ์จริง และมีการเสนอแนะแนวทางแก้ปัญหาที่สร้างสรรค์', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ได้อย่างถูกต้องและเหมาะสมในสถานการณ์ส่วนใหญ่ พร้อมมีข้อเสนอที่ดี', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ในงานที่ได้รับมอบหมายได้ดีในระดับพื้นฐาน', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ประยุกต์ใช้ความรู้ได้บางส่วน แต่ขาดความสมบูรณ์หรือความเหมาะสมในบางกรณี', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถประยุกต์ใช้ความรู้ทางเศรษฐศาสตร์ในงานได้อย่างเหมาะสม (2)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้เทคโนโลยีและวิทยาการข้อมูล (Data Science) ในการวิเคราะห์ข้อมูลและสนับสนุนกระบวนการทำงานในสถานประกอบการได้อย่างมีประสิทธิภาพ | 5 (ยอดเยี่ยม): ใช้เทคโนโลยีและเครื่องมือ Data Science ในการวิเคราะห์ข้อมูลได้อย่างแม่นยำ ครบถ้วน และมีประสิทธิภาพ', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ใช้เทคโนโลยีและเครื่องมือได้อย่างถูกต้องและมีประสิทธิภาพในส่วนใหญ่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ใช้เทคโนโลยีและเครื่องมือได้ในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดเล็กน้อย', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ใช้เทคโนโลยีได้ในบางกรณี แต่ยังมีข้อผิดพลาดชัดเจน', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถใช้เทคโนโลยีหรือเครื่องมือได้อย่างถูกต้อง', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้กระบวนการวิจัยเพื่อวิเคราะห์ สังเคราะห์ และนำเสนอข้อมูลในฐานะนักเศรษฐศาสตร์ได้อย่างเป็นระบบ เพื่อตอบโจทย์งานที่ได้รับมอบหมายและจัดทำรายงานสหกิจศึกษาที่สมบูรณ์ | 5 (ยอดเยี่ยม): ใช้กระบวนการวิจัยได้ครบถ้วน สอดคล้องกับเป้าหมาย และจัดทำรายงานที่มีคุณภาพสูง', NULL, 'LO3', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ใช้กระบวนการวิจัยได้ดีในส่วนใหญ่ และจัดทำรายงานที่ชัดเจน', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ใช้กระบวนการวิจัยในระดับพื้นฐานและจัดทำรายงานที่เข้าใจได้', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ใช้กระบวนการวิจัยได้เพียงบางส่วน และรายงานขาดความสมบูรณ์', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถใช้กระบวนการวิจัยหรือจัดทำรายงานได้อย่างเหมาะสม', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารและประสานงานกับเพื่อนร่วมงานและบุคลากรในสถานประกอบการ ทั้งภาษาไทยและภาษาอังกฤษได้อย่างมีประสิทธิภาพเพื่อบรรลุเป้าหมายของงาน | 5 (ยอดเยี่ยม): สื่อสารภาษาไทยและภาษาอังกฤษได้อย่างมืออาชีพ ชัดเจน และเหมาะสมกับบริบท', NULL, 'LO4', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'สื่อสารภาษาไทยและภาษาอังกฤษได้ดีในสถานการณ์ส่วนใหญ่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'สื่อสารได้ในระดับพื้นฐาน แต่ยังมีจุดที่ต้องปรับปรุง', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'สื่อสารได้บ้าง แต่มีข้อผิดพลาดที่ทำให้เกิดความไม่ชัดเจน', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถสื่อสารได้อย่างเหมาะสม', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปรับตัวและรับมือกับการเปลี่ยนแปลงในสถานประกอบการ เช่น สภาพแวดล้อมการทำงาน หรือวัฒนธรรมองค์กรได้อย่างเหมาะสม | 5 (ยอดเยี่ยม): ปรับตัวและรับมือกับการเปลี่ยนแปลงในสถานประกอบการได้อย่างมีประสิทธิภาพ พร้อมเสนอแนวทางแก้ไขที่เหมาะสม', NULL, 'LO5', 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ปรับตัวได้ดีในสถานการณ์ส่วนใหญ่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ปรับตัวได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางกรณี', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ปรับตัวได้บางส่วน แต่ยังขาดความยืดหยุ่นหรือการตอบสนองที่เหมาะสม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถปรับตัวได้เมื่อเกิดการเปลี่ยนแปลง (3)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบและคำนึงถึงจริยธรรม | 5 (ยอดเยี่ยม): แสดงออกถึงความรับผิดชอบและจริยธรรมในวิชาชีพได้อย่างชัดเจนในทุกสถานการณ์', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'แสดงความรับผิดชอบและจริยธรรมในสถานการณ์ส่วนใหญ่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ปฏิบัติงานด้วยจริยธรรมในระดับพื้นฐาน', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'แสดงความรับผิดชอบได้บางส่วน แต่ยังมีข้อบกพร่อง', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ขาดความรับผิดชอบหรือไม่คำนึงถึงจริยธรรม', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติตามระเบียบและวัฒนธรรมองค์กร | 5 (ยอดเยี่ยม): ปฏิบัติตามระเบียบและวัฒนธรรมองค์กรได้อย่างเคร่งครัดและเป็นแบบอย่างที่ดี', NULL, 'LO7', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ปฏิบัติตามระเบียบได้ในสถานการณ์ส่วนใหญ่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ปฏิบัติตามระเบียบในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดเล็กน้อย', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ปฏิบัติตามได้บางส่วน แต่ยังไม่ครบถ้วน', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่ปฏิบัติตามระเบียบหรือขาดความเข้าใจในวัฒนธรรมองค์กร (4)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพทั้งในฐานะผู้นำและผู้ตาม พร้อมแสดงออกถึงความคิดสร้างสรรค์และข้อเสนอแนะที่เป็นประโยชน์ต่อองค์กร | 5 (ยอดเยี่ยม): ทำงานร่วมกับผู้อื่นได้อย่างมีประสิทธิภาพทั้งในฐานะผู้นำและผู้ตาม พร้อมเสนอแนะที่เป็นประโยชน์', NULL, 'LO8', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ทำงานร่วมกับผู้อื่นได้ดีในสถานการณ์ส่วนใหญ่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ทำงานร่วมกับผู้อื่นในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางจุด', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ทำงานร่วมกับผู้อื่นได้บางส่วน แต่มีความขัดแย้งหรือการสื่อสารที่ไม่ชัดเจน', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถทำงานร่วมกับผู้อื่นได้อย่างเหมาะสม', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถพัฒนาตนเอง เรียนรู้อย่างต่อเนื่อง และเตรียมความพร้อมเพื่อก้าวเข้าสู่วิชาชีพในอนาคต | 5 (ยอดเยี่ยม): แสดงความกระตือรือร้นในการพัฒนาตนเองและเรียนรู้อย่างต่อเนื่อง พร้อมนำความรู้ใหม่ไปประยุกต์ใช้', NULL, 'LO9', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'แสดงความตั้งใจในการเรียนรู้และพัฒนาตนเองในสถานการณ์ส่วนใหญ่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'มีการพัฒนาตนเองในระดับพื้นฐาน แต่ยังขาดความสม่ำเสมอ', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'มีความพยายามพัฒนาตนเองเพียงบางส่วน', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ขาดความกระตือรือร้นในการเรียนรู้หรือพัฒนาตนเอง', 1, 4);
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรบัญชีบัณฑิต (ปรับปรุง พ.ศ. 2567)', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา(หลักสูตรบัญชีบัณฑิต-ปรับปรุง-2567).docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้หลักการบัญชี มาตรฐานการรายงานทางการเงิน และศาสตร์ที่เกี่ยวข้องกับวิชาชีพบัญชี ในการปฏิบัติงานสถานประกอบการได้อย่างเหมาะสม', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถวิเคราะห์และแปลผลข้อมูลทางบัญชี เพื่อสนับสนุนการตัดสินใจในสถานประกอบการได้', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ผู้เรียนสามารถสื่อสารด้วยภาษาไทยและภาษาอังกฤษในการปฏิบัติงานบัญชีได้อย่างมีประสิทธิภาพ', NULL, 'LO3', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเรียนรู้และพัฒนาทักษะใหม่ที่เกี่ยวข้องกับงานบัญชีด้วยตนเองได้', NULL, 'LO4', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบ และคำนึงถึงจรรยาบรรณวิชาชีพบัญชี', NULL, 'LO5', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีมได้อย่างมีประสิทธิภาพ และแสดงความเป็นผู้นำ ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้หลักการบัญชี มาตรฐานการรายงานทางการเงิน และศาสตร์ที่เกี่ยวข้องกับวิชาชีพบัญชี ในการปฏิบัติงานสถานประกอบการได้อย่างเหมาะสม | 5 (ยอดเยี่ยม): ประยุกต์ใช้หลักการบัญชีได้อย่างคล่องแคล่ว ถูกต้อง และสร้างสรรค์', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ประยุกต์ใช้หลักการบัญชีได้ดี มีข้อผิดพลาดเล็กน้อยที่ไม่กระทบต่อผลลัพธ์', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ประยุกต์ใช้หลักการบัญชีในระดับพื้นฐาน แต่ขาดความสามารถในการประยุกต์ใช้แบบเจาะจงหรือลึกซึ้ง', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ประยุกต์ใช้หลักการบัญชีได้บางส่วน ต้องการคำแนะนำ และยังขาดความแม่นยำในการปฏิบัติงาน', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถประยุกต์ใช้หลักการบัญชีได้ ยังขาดความรู้พื้นฐานและต้องการเสริมทักษะอย่างมาก (2)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถวิเคราะห์และแปลผลข้อมูลทางบัญชี เพื่อสนับสนุนการตัดสินใจในสถานประกอบการได้ | 5 (ยอดเยี่ยม): วิเคราะห์ข้อมูลเชิงลึก สรุปผลชัดเจน และนำเสนออย่างเป็นระบบ', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'วิเคราะห์ข้อมูลได้ดี มีข้อสรุปที่เป็นประโยชน์', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'วิเคราะห์ข้อมูลในระดับพื้นฐานและมีข้อสรุปที่ใช้งานได้', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'วิเคราะห์ข้อมูลได้บางส่วนหรือไม่ครอบคลุม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถวิเคราะห์ข้อมูลได้อย่างถูกต้อง ขาดทักษะการสรุปผลและนำเสนออย่างมีประสิทธิภาพ', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ผู้เรียนสามารถสื่อสารด้วยภาษาไทยและภาษาอังกฤษในการปฏิบัติงานบัญชีได้อย่างมีประสิทธิภาพ | 5 (ยอดเยี่ยม): สื่อสารได้อย่างคล่องแคล่ว ชัดเจน และเหมาะสมกับสถานการณ์', NULL, 'LO3', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'สื่อสารได้ดี มีข้อผิดพลาดเล็กน้อยไม่กระทบต่อความเข้าใจ', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'สื่อสารในระดับพื้นฐานที่สามารถเข้าใจได้ แต่ยังขาดความเข้าใจในบางจุด', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'สื่อสารได้บางส่วน มีข้อจำกัดด้านความชัดเจนหรือการใช้ภาษา', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถสื่อสารได้อย่างเหมาะสมในสถานการณ์การทำงาน / ฝึกงาน', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเรียนรู้และพัฒนาทักษะใหม่ที่เกี่ยวข้องกับงานบัญชีด้วยตนเองได้ | 5 (ยอดเยี่ยม): เรียนรู้และพัฒนาทักษะใหม่ได้อย่างรวดเร็ว และประยุกต์ใช้อย่างมีประสิทธิภาพ', NULL, 'LO4', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'เรียนรู้และพัฒนาทักษะใหม่ได้ดี มีความเข้าใจเนื้อหา และการใช้งาน', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'เรียนรู้และพัฒนาทักษะในระดับพื้นฐาน แต่ยังขาดการประยุกต์ใช้อย่างมีประสิทธิภาพ', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'เรียนรู้และพัฒนาทักษะได้บางส่วน และต้องการคำแนะนำเพิ่มเติม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถเรียนรู้และพัฒนาทักษะได้ด้วยตนเอง (3)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบ และคำนึงถึงจรรยาบรรณวิชาชีพบัญชี | 5 (ยอดเยี่ยม): ปฏิบัติตามจรรยาบรรณอย่างเคร่งครัด เป็นแบบอย่างที่ดี และแสดงความรับผิดชอบสูงสุด', NULL, 'LO5', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ปฏิบัติตามจรรยาบรรณได้ดี มีความรับผิดชอบต่อหน้าที่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ปฏิบัติตามจรรยาบรรณในระดับพื้นฐาน แต่ยังขาดความรอบคอบในบางจุด', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ปฏิบัติตามจรรยาบรรณได้บางส่วน และต้องการคำแนะนำเพิ่มเติม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่ปฏิบัติตามจรรยาบรรณ หรือขาดความรับผิดชอบในงาน (4)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีมได้อย่างมีประสิทธิภาพ และแสดงความเป็นผู้นำ | 5 (ยอดเยี่ยม): เป็นผู้นำที่ดี ทำงานเป็นทีมอย่างมีประสิทธิภาพสูง และสามารถแก้ปัญหาที่ซับซ้อนได้อย่างเป็นระบบ', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ทำงานเป็นทีมได้ดี มีความรับผิดชอบ แสดงบทบาทผู้นำได้ดีในสถานการณ์ทั่วไป', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ทำงานเป็นทีมในระดับพื้นฐาน แต่ยังขาดความเป็นผู้นำที่ชัดเจน และยังต้องการพัฒนาทักษะในด้านการประสานงาน', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ทำงานเป็นทีมได้บางส่วน ยังต้องการคำแนะนำในการปรับปรุงตนเองและการสร้างความสัมพันธ์ในทีม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถทำงานเป็นทีมได้ หรือหลีกเลี่ยงความรับผิดชอบ', 1, 4);
END $$;

