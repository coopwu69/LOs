DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิศวกรรมปิโตรเคมีและพอลิเมอร์', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา-ปิโตรเคมีฯ.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานวิศวกรรมปิโตรเคมีและพอลิเมอร์ โดยประยุกต์ใช้หลักการทางวิศวกรรมศาสตร์ วิทยาศาสตร์ และคณิตศาสตร์ ในการวิเคราะห์และแก้ไขปัญหาที่เกิดขึ้นในสถานประกอบการ', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้ในการออกแบบทางวิศวกรรม การวิเคราะห์เชิงสถิติ และการประเมินคุณสมบัติในการตรวจสอบและแก้ปัญหาในกระบวนการทำงานของสถานประกอบการ โดยคำนึงถึงปัจจัยด้านสาธารณสุข ความปลอดภัย และสิ่งแวดล้อม', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารอย่างมีประสิทธิภาพด้วยภาษาไทยและอังกฤษ ในบริบทการทำงานด้านวิศวกรรม ปิโตรเคมีและพอลิเมอร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานได้อย่างเหมาะสม', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้เทคโนโลยีสารสนเทศ และเครื่องมือทางวิศวกรรมในการปฏิบัติงานอย่างถูกต้องและเหมาะสม', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสืบค้นและประยุกต์ใช้ความรู้ใหม่มาพัฒนาทักษะการทดลอง วิเคราะห์ข้อมูล เพื่อพัฒนาตนเองอย่างต่อเนื่องในระหว่างปฏิบัติสหกิจศึกษา', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนปฏิบัติงานด้วยความรับผิดชอบ ซื่อสัตย์ และตระหนักถึงจริยธรรมวิชาชีพ โดยคำนึงถึงผลกระทบ ต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีมอย่างมีประสิทธิภาพ ภาวะความเป็นผู้นำ และปรับตัวภายใต้สถานการณ์ที่หลากหลายตามสถานะของตนเองในทีม ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULLIF('', ''), NULLIF('LO7', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานวิศวกรรมปิโตรเคมีและพอลิเมอร์ โดยประยุกต์ใช้หลักการทางวิศวกรรมศาสตร์ วิทยาศาสตร์ และคณิตศาสตร์ ในการวิเคราะห์และแก้ไขปัญหาที่เกิดขึ้นในสถานประกอบการ |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาที่ซับซ้อนได้อย่างครบถ้วน พร้อมเสนอแนวทางแก้ไขที่สร้างสรรค์ มีประสิทธิภาพสูง และตอบโจทย์ความต้องการของสถานประกอบการได้อย่างสมบูรณ์   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อยแต่ไม่กระทบต่อคุณภาพโดยรวม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้บางส่วน แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้ในการออกแบบทางวิศวกรรม การวิเคราะห์เชิงสถิติ และการประเมินคุณสมบัติในการตรวจสอบและแก้ปัญหาในกระบวนการทำงานของสถานประกอบการ โดยคำนึงถึงปัจจัยด้านสาธารณสุข ความปลอดภัย และสิ่งแวดล้อม |   5 (ยอดเยี่ยม): ประยุกต์ใช้ความรู้ได้อย่างสมบูรณ์วิเคราะห์ข้อมูลเชิงลึกครอบคลุม แก้ปัญหาได้อย่างเป็นระบบและคิดริเริ่มสร้างสรรค์   4 (ดีมาก): ประยุกต์ใช้ความรู้ได้ดี วิเคราะห์ข้อมูลถูกต้องเป็นส่วนใหญ่ แก้ปัญหาได้อย่างมีประสิทธิภาพ   3 (ดี): ประยุกต์ใช้ความรู้ได้พอใช้ วิเคราะห์ข้อมูลได้ตามเกณฑ์ แก้ปัญหาได้ตามคำแนะนำ   2 (พอใช้): ขาดความเชื่อมโยงของความรู้          การวิเคราะห์ยังไม่ครอบคลุม ต้องการคำแนะนำเพิ่มเติม   1 (ต้องปรับปรุง): ไม่สามารถประยุกต์ใช้ความรู้ ขาดทักษะการวิเคราะห์ ไม่คำนึงถึงปัจจัยสำคัญ (2)', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารอย่างมีประสิทธิภาพด้วยภาษาไทยและอังกฤษ ในบริบทการทำงานด้านวิศวกรรม ปิโตรเคมีและพอลิเมอร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): สื่อสารได้ชัดเจน เข้าใจง่าย ใช้ภาษาไทยและภาษาอังกฤษได้อย่างเหมาะสมกับสถานการณ์   4 (ดีมาก): สื่อสารได้ดีในระดับที่เหมาะสม แม้จะมีข้อผิดพลาดเล็กน้อยที่ไม่กระทบต่อการทำงาน   3 (ดี): สื่อสารได้ในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดหรือจุดที่ไม่ชัดเจนในบางสถานการณ์   2 (พอใช้): สื่อสารได้บ้าง แต่ยังไม่เหมาะสมกับสถานการณ์หรือมีข้อผิดพลาดที่ส่งผลต่อการทำงาน   1 (ต้องปรับปรุง): ไม่สามารถสื่อสารได้อย่างเหมาะสมในสถานการณ์จริง', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้เทคโนโลยีสารสนเทศ และเครื่องมือทางวิศวกรรมในการปฏิบัติงานอย่างถูกต้องและเหมาะสม |   5 (ยอดเยี่ยม): ใช้เทคโนโลยีสารสนเทศได้อย่าง ชำนาญและสร้างสรรค์ เลือกและประยุกต์เครื่องมือได้ เหมาะสมกับงานอย่างมีประสิทธิภาพสูงสุด   4 (ดีมาก): ใช้เทคโนโลยีสารสนเทศได้ดี เลือกเครื่องมือถูกต้องแม่นยำ มีประสิทธิภาพในการปฏิบัติงาน   3 (ดี): ใช้เทคโนโลยีสารสนเทศพื้นฐาน เลือกเครื่องมือได้ตามคำแนะนำ   2 (พอใช้): ขาดทักษะการใช้เทคโนโลยีสารสนเทศ เลือกเครื่องมือไม่เหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถใช้เทคโนโลยีสารสนเทศ เลือกเครื่องมือผิดพลาดบ่อย ขาดความเข้าใจพื้นฐาน', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสืบค้นและประยุกต์ใช้ความรู้ใหม่มาพัฒนาทักษะการทดลอง วิเคราะห์ข้อมูล เพื่อพัฒนาตนเองอย่างต่อเนื่องในระหว่างปฏิบัติสหกิจศึกษา |   5 (ยอดเยี่ยม): นักศึกษาสามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้อย่างรวดเร็วและนำไปประยุกต์ใช้ในงานได้อย่างมีประสิทธิภาพ มีการริเริ่มในการศึกษาข้อมูลเพิ่มเติมด้วยตัวเอง และแสดงผลลัพธ์ที่ชัดเจน   4 (ดีมาก): นักศึกษาสามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้ดี และสามารถนำไปใช้ในงานได้ในระดับที่เหมาะสม แม้จะมีการปรับปรุงในบางส่วน   3 (ดี): นักศึกษาสามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้ในระดับพื้นฐาน และเริ่มต้นนำไปใช้ในงานบางส่วน แต่ยังขาดความสมบูรณ์   2 (พอใช้): นักศึกษาสามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้ในระดับที่จำกัด และยังไม่สามารถประยุกต์ใช้ได้อย่างเหมาะสม   1 (ต้องปรับปรุง): นักศึกษาไม่สามารถสืบค้นองค์ความรู้และเรียนรู้ทักษะใหม่ได้ด้วยตนเอง และขาดความพยายามในการพัฒนาตนเอง (3)', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนปฏิบัติงานด้วยความรับผิดชอบ ซื่อสัตย์ และตระหนักถึงจริยธรรมวิชาชีพ โดยคำนึงถึงผลกระทบต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบอย่างชัดเจน   4 (ดีมาก): ปฏิบัติตามกฎระเบียบส่วนใหญ่ และแสดงความรับผิดชอบในงานได้ดี แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีมอย่างมีประสิทธิภาพ ภาวะความเป็นผู้นำ และปรับตัวภายใต้สถานการณ์ที่หลากหลายตามสถานะของตนเองในทีม |   5 (ยอดเยี่ยม): มีบทบาทสำคัญในทีม ช่วยสร้างสภาพแวดล้อมการทำงานที่ดี และแสดงภาวะผู้นำได้อย่างชัดเจน   4 (ดีมาก): ทำงานร่วมกับทีมได้ดีในระดับที่เหมาะสม และปฏิบัติงานตามบทบาทที่ได้รับอย่างสมบูรณ์   3 (ดี): ทำงานร่วมกับทีมได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางด้าน   2 (พอใช้): ทำงานร่วมกับทีมได้บางส่วน แต่มีปัญหาในการสื่อสารหรือการมีส่วนร่วม   1 (ต้องปรับปรุง): ไม่สามารถทำงานร่วมกับทีมได้อย่างเหมาะสม', NULLIF('', ''), NULLIF('LO7', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;

