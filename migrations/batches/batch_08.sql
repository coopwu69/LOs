DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรเทคโนโลยีดิจิทัลทางการแพทย์', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.96, true
  FROM public.assessment_source_documents sd WHERE sd.filename = '2.ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรเทคโนโลยีดิจิทัลทางการแพทย์ พ.ศ.67.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์ความรู้ในการพัฒนาระบบงานด้านปัญญาประดิษฐ์ทางการแพทย์ หรือ นวัตกรรมการแพทย์ดิจิทัล ได้อย่างเหมาะสมกับความต้องการของผู้ใช้', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถรวบรวม วิเคราะห์ และแปลผลข้อมูลจากการปฏิบัติงานในสถานประกอบการ พัฒนาระบบงาน หรือแก้ปัญหา หรือสร้างนวัตกรรมทางการแพทย์และสุขภาพ ด้วยเทคโนโลยีดิจิทัล', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานตามกฎระเบียบของสถานประกอบการด้วยความรับผิดชอบและคำนึงถึงจริยธรรมในวิชาชีพ โดยพิจารณาผลกระทบต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีม ได้อย่างมีประสิทธิภาพ มีความคิดริเริ่ม กำหนดเป้าหมาย วางแผน ปฏิบัติงานด้วยตนเอง พร้อมทั้งแสดงบทบาทความเป็นผู้นำและผู้ตามที่ดีตามสถานะของตนเองในทีม ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์ความรู้ในการพัฒนาระบบงานด้านปัญญาประดิษฐ์ทางการแพทย์ หรือ นวัตกรรมการแพทย์ดิจิทัล ได้อย่างเหมาะสมกับความต้องการของผู้ใช้ |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาได้อย่างครบถ้วน พร้อมเสนอแนวทางแก้ไขที่สร้างสรรค์ มีประสิทธิภาพสูง และตอบโจทย์ความต้องการของสถานประกอบการได้ตรงกับความต้องการของหน่วยงาน   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อยแต่ไม่กระทบต่อคุณภาพโดยรวม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้บางส่วน แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข (2)', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถรวบรวม วิเคราะห์ และแปลผลข้อมูลจากการปฏิบัติงานในสถานประกอบการ พัฒนาระบบงาน หรือแก้ปัญหา หรือสร้างนวัตกรรมทางการแพทย์และสุขภาพ ด้วยเทคโนโลยีดิจิทัล |   5 (ยอดเยี่ยม): วิเคราะห์ข้อมูลได้อย่างถูกต้อง ครบถ้วน และแปลผลได้ชัดเจน พร้อมข้อสรุปที่นำไปใช้ได้จริง   4 (ดีมาก): วิเคราะห์ข้อมูลได้ดีในระดับที่เหมาะสม พร้อมข้อสรุปที่เป็นประโยชน์ แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): วิเคราะห์ข้อมูลได้ในระดับพื้นฐาน แต่ข้อสรุปยังขาดความชัดเจนและสมบูรณ์ในบางส่วน   2 (พอใช้): วิเคราะห์ข้อมูลได้เพียงบางส่วน และข้อสรุปยังไม่ชัดเจน ต้องการคำแนะนำเพิ่มเติม   1 (ต้องปรับปรุง): ไม่สามารถวิเคราะห์ข้อมูลหรือแปลผลได้ (3)', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานตามกฎระเบียบของสถานประกอบการด้วยความรับผิดชอบและคำนึงถึงจริยธรรมในวิชาชีพ โดยพิจารณาผลกระทบต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบอย่างชัดเจน   4 (ดีมาก): ปฏิบัติตามกฎระเบียบส่วนใหญ่ และแสดงความรับผิดชอบในงานได้ดี แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีม ได้อย่างมีประสิทธิภาพ มีความคิดริเริ่ม กำหนดเป้าหมาย วางแผน ปฏิบัติงานด้วยตนเอง พร้อมทั้งแสดงบทบาทความเป็นผู้นำและผู้ตามที่ดีตามสถานะของตนเองในทีม |   5 (ยอดเยี่ยม): มีบทบาทสำคัญในทีม มีความคิดริเริ่ม มีการกำหนดเป้าหมายของงาน รวมทั้งวางแผนการทำงานได้ด้วยตนเอง ช่วยสร้างสภาพแวดล้อมการทำงานที่ดี และแสดงภาวะผู้นำได้อย่างชัดเจน   4 (ดีมาก): ทำงานร่วมกับทีมได้ดีในระดับที่เหมาะสม และปฏิบัติงานตามบทบาทที่ได้รับอย่างสมบูรณ์   3 (ดี): ทำงานร่วมกับทีมได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางด้าน   2 (พอใช้): ทำงานร่วมกับทีมได้บางส่วน แต่มีปัญหาในการสื่อสารหรือการมีส่วนร่วม   1 (ต้องปรับปรุง): ไม่สามารถทำงานร่วมกับทีมได้อย่างเหมาะสม', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;

