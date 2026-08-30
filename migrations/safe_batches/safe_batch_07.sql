DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิศวกรรมปิโตรเคมีและพอลิเมอร์', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา-ปิโตรเคมีฯ.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานวิศวกรรมปิโตรเคมีและพอลิเมอร์ โดยประยุกต์ใช้หลักการทางวิศวกรรมศาสตร์ วิทยาศาสตร์ และคณิตศาสตร์ ในการวิเคราะห์และแก้ไขปัญหาที่เกิดขึ้นในสถานประกอบการ', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้ในการออกแบบทางวิศวกรรม การวิเคราะห์เชิงสถิติ และการประเมินคุณสมบัติในการตรวจสอบและแก้ปัญหาในกระบวนการทำงานของสถานประกอบการ โดยคำนึงถึงปัจจัยด้านสาธารณสุข ความปลอดภัย และสิ่งแวดล้อม', NULL, 'LO2', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารอย่างมีประสิทธิภาพด้วยภาษาไทยและอังกฤษ ในบริบทการทำงานด้านวิศวกรรม ปิโตรเคมีและพอลิเมอร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานได้อย่างเหมาะสม', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้เทคโนโลยีสารสนเทศ และเครื่องมือทางวิศวกรรมในการปฏิบัติงานอย่างถูกต้องและเหมาะสม', NULL, 'LO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสืบค้นและประยุกต์ใช้ความรู้ใหม่มาพัฒนาทักษะการทดลอง วิเคราะห์ข้อมูล เพื่อพัฒนาตนเองอย่างต่อเนื่องในระหว่างปฏิบัติสหกิจศึกษา', NULL, 'LO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนปฏิบัติงานด้วยความรับผิดชอบ ซื่อสัตย์ และตระหนักถึงจริยธรรมวิชาชีพ โดยคำนึงถึงผลกระทบ ต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีมอย่างมีประสิทธิภาพ ภาวะความเป็นผู้นำ และปรับตัวภายใต้สถานการณ์ที่หลากหลายตามสถานะของตนเองในทีม ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULL, 'LO7', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานวิศวกรรมปิโตรเคมีและพอลิเมอร์ โดยประยุกต์ใช้หลักการทางวิศวกรรมศาสตร์ วิทยาศาสตร์ และคณิตศาสตร์ ในการวิเคราะห์และแก้ไขปัญหาที่เกิดขึ้นในสถานประกอบการ |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาที่ซับซ้อนได้อย่างครบถ้วน พร้อมเสนอแนวทางแก้ไขที่สร้างสรรค์ มีประสิทธิภาพสูง และตอบโจทย์ความต้องการของสถานประกอบการได้อย่างสมบูรณ์   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อยแต่ไม่กระทบต่อคุณภาพโดยรวม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้บางส่วน แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้ในการออกแบบทางวิศวกรรม การวิเคราะห์เชิงสถิติ และการประเมินคุณสมบัติในการตรวจสอบและแก้ปัญหาในกระบวนการทำงานของสถานประกอบการ โดยคำนึงถึงปัจจัยด้านสาธารณสุข ความปลอดภัย และสิ่งแวดล้อม |   5 (ยอดเยี่ยม): ประยุกต์ใช้ความรู้ได้อย่างสมบูรณ์วิเคราะห์ข้อมูลเชิงลึกครอบคลุม แก้ปัญหาได้อย่างเป็นระบบและคิดริเริ่มสร้างสรรค์   4 (ดีมาก): ประยุกต์ใช้ความรู้ได้ดี วิเคราะห์ข้อมูลถูกต้องเป็นส่วนใหญ่ แก้ปัญหาได้อย่างมีประสิทธิภาพ   3 (ดี): ประยุกต์ใช้ความรู้ได้พอใช้ วิเคราะห์ข้อมูลได้ตามเกณฑ์ แก้ปัญหาได้ตามคำแนะนำ   2 (พอใช้): ขาดความเชื่อมโยงของความรู้          การวิเคราะห์ยังไม่ครอบคลุม ต้องการคำแนะนำเพิ่มเติม   1 (ต้องปรับปรุง): ไม่สามารถประยุกต์ใช้ความรู้ ขาดทักษะการวิเคราะห์ ไม่คำนึงถึงปัจจัยสำคัญ (2)', NULL, 'LO2', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารอย่างมีประสิทธิภาพด้วยภาษาไทยและอังกฤษ ในบริบทการทำงานด้านวิศวกรรม ปิโตรเคมีและพอลิเมอร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): สื่อสารได้ชัดเจน เข้าใจง่าย ใช้ภาษาไทยและภาษาอังกฤษได้อย่างเหมาะสมกับสถานการณ์   4 (ดีมาก): สื่อสารได้ดีในระดับที่เหมาะสม แม้จะมีข้อผิดพลาดเล็กน้อยที่ไม่กระทบต่อการทำงาน   3 (ดี): สื่อสารได้ในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดหรือจุดที่ไม่ชัดเจนในบางสถานการณ์   2 (พอใช้): สื่อสารได้บ้าง แต่ยังไม่เหมาะสมกับสถานการณ์หรือมีข้อผิดพลาดที่ส่งผลต่อการทำงาน   1 (ต้องปรับปรุง): ไม่สามารถสื่อสารได้อย่างเหมาะสมในสถานการณ์จริง', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้เทคโนโลยีสารสนเทศ และเครื่องมือทางวิศวกรรมในการปฏิบัติงานอย่างถูกต้องและเหมาะสม |   5 (ยอดเยี่ยม): ใช้เทคโนโลยีสารสนเทศได้อย่าง ชำนาญและสร้างสรรค์ เลือกและประยุกต์เครื่องมือได้ เหมาะสมกับงานอย่างมีประสิทธิภาพสูงสุด   4 (ดีมาก): ใช้เทคโนโลยีสารสนเทศได้ดี เลือกเครื่องมือถูกต้องแม่นยำ มีประสิทธิภาพในการปฏิบัติงาน   3 (ดี): ใช้เทคโนโลยีสารสนเทศพื้นฐาน เลือกเครื่องมือได้ตามคำแนะนำ   2 (พอใช้): ขาดทักษะการใช้เทคโนโลยีสารสนเทศ เลือกเครื่องมือไม่เหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถใช้เทคโนโลยีสารสนเทศ เลือกเครื่องมือผิดพลาดบ่อย ขาดความเข้าใจพื้นฐาน', NULL, 'LO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสืบค้นและประยุกต์ใช้ความรู้ใหม่มาพัฒนาทักษะการทดลอง วิเคราะห์ข้อมูล เพื่อพัฒนาตนเองอย่างต่อเนื่องในระหว่างปฏิบัติสหกิจศึกษา |   5 (ยอดเยี่ยม): นักศึกษาสามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้อย่างรวดเร็วและนำไปประยุกต์ใช้ในงานได้อย่างมีประสิทธิภาพ มีการริเริ่มในการศึกษาข้อมูลเพิ่มเติมด้วยตัวเอง และแสดงผลลัพธ์ที่ชัดเจน   4 (ดีมาก): นักศึกษาสามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้ดี และสามารถนำไปใช้ในงานได้ในระดับที่เหมาะสม แม้จะมีการปรับปรุงในบางส่วน   3 (ดี): นักศึกษาสามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้ในระดับพื้นฐาน และเริ่มต้นนำไปใช้ในงานบางส่วน แต่ยังขาดความสมบูรณ์   2 (พอใช้): นักศึกษาสามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้ในระดับที่จำกัด และยังไม่สามารถประยุกต์ใช้ได้อย่างเหมาะสม   1 (ต้องปรับปรุง): นักศึกษาไม่สามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้ด้วยตนเอง และขาดความพยายามในการพัฒนาตนเอง (3)', NULL, 'LO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนปฏิบัติงานด้วยความรับผิดชอบ ซื่อสัตย์ และตระหนักถึงจริยธรรมวิชาชีพ โดยคำนึงถึงผลกระทบต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบอย่างชัดเจน   4 (ดีมาก): ปฏิบัติตามกฎระเบียบส่วนใหญ่ และแสดงความรับผิดชอบในงานได้ดี แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีมอย่างมีประสิทธิภาพ ภาวะความเป็นผู้นำ และปรับตัวภายใต้สถานการณ์ที่หลากหลายตามสถานะของตนเองในทีม |   5 (ยอดเยี่ยม): มีบทบาทสำคัญในทีม ช่วยสร้างสภาพแวดล้อมการทำงานที่ดี และแสดงภาวะผู้นำได้อย่างชัดเจน   4 (ดีมาก): ทำงานร่วมกับทีมได้ดีในระดับที่เหมาะสม และปฏิบัติงานตามบทบาทที่ได้รับอย่างสมบูรณ์   3 (ดี): ทำงานร่วมกับทีมได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางด้าน   2 (พอใช้): ทำงานร่วมกับทีมได้บางส่วน แต่มีปัญหาในการสื่อสารหรือการมีส่วนร่วม   1 (ต้องปรับปรุง): ไม่สามารถทำงานร่วมกับทีมได้อย่างเหมาะสม', NULL, 'LO7', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'รายวิชา CPE67-493 สหกิจศึกษา', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา-วิศวกรรมเคมีฯ.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์ใข้ความรู้ทาง วิทยาศาสตร์ คณิตศาสตร์และสถิติได้อย่างเหมาะสม', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเลือกใช้เครื่องมือและเทคโนโลยีสารสนเทศที่เหมาะสมในการสืบค้นข้อมูลและความรู้ใหม่ สามารถรวบรวม วิเคราะห์ และสังเคราะห์ข้อมูล เพื่อหาข้อสรุปในการปฏิบัติงานในสถานประกอบการได้', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ผู้เรียนอ่านและเขียนแบบทางวิศวกรรม เข้าใจหลักการทำงานของอุปกรณ์และกระบวนการการผลิตที่เกี่ยวข้องกับงานที่ได้รับมอบหมายจากสถานประกอบสหกิจศึกษาได้', NULL, 'LO3', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเพื่อวิเคราะห์และแก้ปัญหาทางวิศวกรรมเคมีและเคมีเภสัชกรรมโดยคำนึงถึงความปลอดภัย เศรษฐศาสตร์ การบริหารงานวิศวกรรม และผลกระทบทางสิ่งแวดล้อมและพลังงาน ในการปฏิบัติงานสหกิจศึกษาได้อย่างเหมาะสม', NULL, 'LO4', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้', NULL, 'LO5', 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบและคำนึงถึงจริยธรรมและหลักวิชาชีพ', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถติดต่อสื่อสารทั้งภาษาไทยและภาษาอังกฤษ และทำงานร่วมกับผู้อื่นได้ในการปฏิบัติงานสหกิจศึกษาได้อย่างมีประสิทธิภาพ', NULL, 'LO7', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถแสวงหาความรู้ใหม่ที่ได้จากการปฏิบัติงานสหกิจศึกษาได้ ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULL, 'LO8', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์ใข้ความรู้ทาง วิทยาศาสตร์ คณิตศาสตร์และสถิติได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาที่ซับซ้อนได้อย่างครบถ้วน เสนอแนวทางแก้ไขที่สร้างสรรค์ สามารถสร้างนวัตกรรมการทำงานหรือแนวปฏิบัติที่ดีที่นำไปสู่การใช้งานได้จริง   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน เสนอแนะข้อเสนอแนวทางแก้ไขได้แต่ยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้ แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำ   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข (2)', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเลือกใช้เครื่องมือและเทคโนโลยีสารสนเทศที่เหมาะสมในการสืบค้นข้อมูลและความรู้ใหม่ สามารถรวบรวม วิเคราะห์ และสังเคราะห์ข้อมูล เพื่อหาข้อสรุปในการปฏิบัติงานในสถานประกอบการได้ |   5 (ยอดเยี่ยม): เลือกใช้เครื่องมือและเทคโนโลยีสารสนเทศในการรวมเรม วิเคราะห์ และ สังเคราะห์ข้อมูลได้อย่างถูกต้อง ครบถ้วน พร้อมข้อสรุปที่นวัตกรรมหรือการนำไปใช้ได้จริงเป็นรูปธรรม   4 (ดีมาก): รวบรวม วิเคราะห์ข้อมูลได้ดีในระดับที่เหมาะสม สังเคราะห์ข้อมูลพร้อมข้อสรุปที่เป็นประโยชน์ได้แต่ยังขาดความสมบูณ์ในบางองค์ประกอบ   3 (ดี): วิเคราะห์ข้อมูลได้ในระดับพื้นฐาน   2 (พอใช้): วิเคราะห์ข้อมูลได้เพียงบางส่วน และข้อสรุปยังไม่ชัดเจน ต้องการคำแนะนำ   1 (ต้องปรับปรุง): ไม่สามารถรวบรวม วิเคราะห์และสังเคราะห์ข้อมูลได้', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนอ่านและเขียนแบบทางวิศวกรรม เข้าใจหลักการทำงานของอุปกรณ์และกระบวนการการผลิตที่เกี่ยวข้องกับงานที่ได้รับมอบหมายจากสถานประกอบสหกิจศึกษาได้ |   5 (ยอดเยี่ยม): สามารถอ่านและเขียนแบบทางวิศวกรรม เข้าใจกระบวนการงานที่ได้รับมอบหมาย นำเสนอแนวทางในการปรับปรุงกระบวนการ สร้างสรรค์งานใหม่ได้   4 (ดีมาก): สามารถอ่านและเขียนแบบทางวิศวกรรม เข้าใจกระบวนการงานที่ได้รับมอบหมาย  นำเสนอแนวทางในการปรับปรุงกระบวนการ   3 (ดี): สามารถอ่านและเขียนแบบทางวิศวกรรม เข้าใจกระบวนการงานที่ได้รับมอบหมายในระดับพื้นฐาน   2 (พอใช้): สามารถอ่านและเขียนแบบทางวิศวกรรม เข้าใจกระบวนการงานที่ได้รับมอบหมายได้บ้าง แต่ยังอาจพบข้อผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่สามารถสามารถอ่านและเขียนแบบทางวิศวกรรม ไม่สามารถทำความเข้าใจกระบวนการงานที่ได้รับมอบหมายได้ในสถานการณ์จริง', NULL, 'LO3', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเพื่อวิเคราะห์และแก้ปัญหาทางวิศวกรรมเคมีและเคมีเภสัชกรรมโดยคำนึงถึงความปลอดภัย เศรษฐศาสตร์ การบริหารงานวิศวกรรม และผลกระทบทางสิ่งแวดล้อมและพลังงาน ในการปฏิบัติงานสหกิจศึกษาได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาโดยคำนึงถึงความปลอดภัย เศรษฐศาสตร์ การบริหารงานวิศวกรรม และผลกระทบทางสิ่งแวดล้อมและพลังงานได้อย่างมีประสิทธิภาพ นำไปสู่นวัตกรรมและการปรับปรุงประสิทธิภาพของระบบงาน สร้างแนวปฏิบัติที่ดีที่ชัดเจนเป็นรูปธรรม   4 (ดีมาก): สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาโดยคำนึงถึงความปลอดภัย เศรษฐศาสตร์ การบริหารงานวิศวกรรม และผลกระทบทางสิ่งแวดล้อมและพลังงานได้อย่างเหมาะสม มีข้อเสนอแนะที่นำไปสู่การปรับปรุงประสิทธิภาพของระบบงาน   3 (ดี): สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาได้อย่างเหมาะสม   2 (พอใช้): สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาได้ในระดับที่จำกัด   1 (ต้องปรับปรุง): ไม่สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาในการปฏิบัติงานสหกิจศึกษาได้', NULL, 'LO4', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้ |   5 (ยอดเยี่ยม): ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้อย่างดีเยี่ยม สร้างแนวปฏิบัติที่ดีที่ผู้อื่นนำไปประยุกต์ใช้ได้   4 (ดีมาก): ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้อย่างดี   3 (ดี): ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้อย่างเหมาะสม   2 (พอใช้): ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้อย่างในระดับที่จำกัด ต้องการการปรึกษาดูแลบ้าง   1 (ต้องปรับปรุง): ไม่ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้ ต้องการการดูแลอย่างใกล้ชิด (3)', NULL, 'LO5', 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบและคำนึงถึงจริยธรรมและหลักวิชาชีพ |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบเป็นที่ประจักษ์   4 (ดีมาก): ปฏิบัติตามกฎระเบียบ มีความรับผิดชอบในงาน พบข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบและแสดงความรับผิดชอบในงานได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถติดต่อสื่อสารทั้งภาษาไทยและภาษาอังกฤษ และทำงานร่วมกับผู้อื่นได้ในการปฏิบัติงานสหกิจศึกษาได้อย่างมีประสิทธิภาพ |   5 (ยอดเยี่ยม): มีบทบาทสำคัญในทีม ช่วยสร้างสภาพแวดล้อมการทำงานที่ดี และแสดงภาวะผู้นำได้อย่างชัดเจน   4 (ดีมาก): ทำงานร่วมกับทีมได้ดีในระดับที่เหมาะสม และปฏิบัติงานตามบทบาทที่ได้รับอย่างสมบูรณ์   3 (ดี): ทำงานร่วมกับทีมได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางด้าน   2 (พอใช้): ทำงานร่วมกับทีมได้บางส่วน แต่มีปัญหาในการสื่อสารหรือการมีส่วนร่วม   1 (ต้องปรับปรุง): ไม่สามารถทำงานร่วมกับทีมได้อย่างเหมาะสม', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถแสวงหาความรู้ใหม่ที่ได้จากการปฏิบัติงานสหกิจศึกษาได้ |   5 (ยอดเยี่ยม): แสวงหาความรู้ใหม่เพื่อสนับสนุนการปฏิบัติงานสหกิจศึกษาได้เป็นอย่างดี สังเคราะห์ความรู้ใหม่จากการปฏิบัติงานสหกิจศึกษาได้โดยรวบรวมและนำเสนอองค์ความรู้ใหม่ได้อย่างครบถ้วนและเป็นระบบ   4 (ดีมาก): แสวงหาความรู้ใหม่เพื่อสนับสนุนการปฏิบัติงานสหกิจศึกษาได้เป็นอย่างดี รวบรวมและนำเสนอองค์ความรู้ใหม่ได้   3 (ดี): แสวงหา รวบรวม และนำเสนอองค์ความรู้ใหม่ได้ แต่ยังขาดความสมบูรณ์บางประเด็น   2 (พอใช้): แสวงหา รวบรวม และนำเสนอองค์ความรู้ใหม่ได้อย่างมีขีดจำกัด ต้องการคำแนะนำชี้แนะ   1 (ต้องปรับปรุง): ไม่แสวงหาความรู้ใหม่เพื่อสนับสนุนการปฏิบัติงานสหกิจศึกษาได้', NULL, 'LO8', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
END $$;

