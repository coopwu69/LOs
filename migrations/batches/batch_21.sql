DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิทยาศาสตรบัณฑิตสาขาอนามัยสิ่งแวดล้อม', NULLIF('(Sustainable development)', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.82, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา อนามัยสิ่งแวดล้อม.pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'วิเคราะห์ความสัมพันธ์ระหว่างปัจจัยสิ่งแวดล้อมกับสุขภาพมนุษย์', NULLIF('', ''), NULLIF('PLO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ตรวจสอบ เฝ้าระวังประเมินปัจจัยสงแวดล้อมที่มีผลกระทบต่อสขภาพมนุษย์', NULLIF('', ''), NULLIF('PLO2', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ป้องกันและควบคุมปัจจัยเสี่ยงต่อสุขภาพมนุษย์', NULLIF('', ''), NULLIF('PLO3', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ควบคุมและอำนวยการการปฏิบัติงานทางด้านอนามัยสิ่งแวดล้อม', NULLIF('', ''), NULLIF('PLO4', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ออกแบบกระบวนการ และให้คําปรึกษา เพื่อป้องกันและลดปัจจัยสิ่งแวดล้อมที่มีผลต่อสุขภาพ', NULLIF('', ''), NULLIF('PLO5', ''), 'single_choice'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'สื่อสารความเสี่ยงด้านอนามัยสิ่งแวดล้อม', NULLIF('', ''), NULLIF('PLO6', ''), 'single_choice'::question_type, true, 6)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีภาวะผู้นํา และคุณธรรมจริยธรรม ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา (Course Learning Outcome: CLO) CLO1 วิเคราะห์ความสัมพันธ์ระหว่างปัจจัยสิ่งแวดล้อมต่อสุขภาพของมนุษย์ในการปฏิบัติงานสหกิจศึกษา CLO2 ตรวจสอบ เฝ้าระวัง และประเมินปัจจัยสิ่งแวดล้อมที่ส่งผลกระทบต่อสุขภาพมนุษย์ในการปฏิบัติงานสหกิจ ศึกษา CLO3 เสนอมาตรการป้องกันและควบคุมปัจจัยเสี่ยงต่อสุขภาพในการปฏิบัติงานสหกิจศึกษา CLO4 ปฏิบัติงานสหกิจศึกษาด้านอนามัยสิ่งแวดล้อมได้ตามวัตถุประสงค์และความต้องการของสถานประกอบการ CLO5 ออกแบบกระบวนการและให้คำปรึกษาด้านอนามัยสิ่งแวดล้อมให้กับสถานประกอบการได้อย่างถูกต้องตาม หลักวิชาการ CLO6 สื่อสารผลการปฏิบัติสหกิจและโครงงานได้อย่างเข้าใจ CLO7 แสดงออกถึงความเป็นผู้นำและปฏิบัติตัวตามวัฒนธรรมขององค์กรอย่างมีคุณธรรมและจริยธรรม แบบประเมินผลการปฏิบัติสหกิจศึกษาตามผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการเรียนรู้ที่คาดหวัง ดีมาก ดี พอใช้ ต้องปรับปรุง (4 คะแนน) (3 คะแนน) (2 คะแนน) (1 คะแนน) CLO1 วิเคราะห์ วิเคราะหค์ วามสัมพันธ์ วิเคราะหไ์ ด้ถูกต้อง วิเคราะหไ์ ด้บางส่วน ไม่สามารถวเิคราะห์ ความสัมพันธร์ ะหว่างปัจจยั ได้อย่างถูกต้อง ในภาพรวม แต่ขาด แต่ยังขาดความ ความสัมพันธไ์ ด้ สิ่งแวดล้อมต่อสุขภาพของ ครอบคลมุ และแสดง รายละเอียดในบาง เชื่อมโยงที่ชัดเจน อย่างถูกต้องหรือ มนุษย์ในการปฏิบตั ิงานสห ความเข้าใจเชิงลึก จุด เหมาะสม กิจศึกษา CLO2 ตรวจสอบ เฝ้าระวัง ตรวจสอบ เฝ้าระวัง ตรวจสอบและ ตรวจสอบได้บางส่วน ไม่สามารถ และประเมินปจั จัย และประเมินปจั จัย ประเมินไดด้ ี แต่ขาด แต่ยังขาดการประเมิน ตรวจสอบและ สิ่งแวดล้อมทสี่ ่งผลกระทบ สิ่งแวดล้อมได้อย่าง ความละเอียดในบาง ที่เหมาะสมหรือ ประเมินได้อยา่ ง ต่อสุขภาพมนุษย์ในการ ถูกต้อง ครอบคลุม และ ประเด็น ครบถ้วน ถูกต้อง ปฏิบัติงานสหกจิ ศึกษา ครบถ้วน ผลการเรียนรู้ที่คาดหวัง ดีมาก ดี พอใช้ ต้องปรับปรุง (4 คะแนน) (3 คะแนน) (2 คะแนน) (1 คะแนน) CLO3 เสนอมาตรการ เสนอมาตรการที่ชัดเจน เสนอมาตรการไดด้ ี เสนอมาตรการได้ ไม่สามารถเสนอ ป้องกันและควบคุมปัจจัย ใช้ได้จริง และมีความ แต่ยังขาด บางส่วน แต่ขาดความ มาตรการที่ เสี่ยงต่อสุขภาพในการ เหมาะสมตามหลัก รายละเอียดใน ชัดเจนหรือความ เหมาะสมได ้ ปฏิบัติงานสหกจิ ศึกษา วิชาการ บางส่วน เหมาะสม CLO4 ปฏิบัติงานสหกิจ ปฏิบัติงานได้ครบถ', NULLIF('', ''), NULLIF('PLO7', ''), 'single_choice'::question_type, true, 7)
  RETURNING id INTO q_id;
END $$;

