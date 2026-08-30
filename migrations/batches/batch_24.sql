DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรการตลาดดิจิทัลและการสร้างแบรนด์', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรการตลาดดิจิทัลและการสร้างแบรนด์.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์แนวคิด ทฤษฎีทางด้านการตลาดดิจิทัลและการสร้างแบรนด์ได้อย่างเหมาะสม', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์แนวคิด ทฤษฎีทางด้านการตลาดดิจิทัลและการสร้างแบรนด์ ไปเชื่อมโยงกับแนวคิดทางด้านอื่นๆ ในการบริหารจัดการองค์กรและการทำธุรกิจได้', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบ คำนึงถึงจริยธรรมและจรรยาบรรณในการประกอบอาชีพด้านการตลาดดิจิทัล และการสร้างแบรนด์และแสดงให้เห็นถึงความมีจิตสำนึกในการรับผิดชอบต่อสังคม', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้เทคโนโลยีสารสนเทศต่างๆ และสามารถสื่อสารทั้งภาษาไทยและภาษาต่างประเทศที่จำเป็นในการประกอบอาชีพทางด้านการตลาดดิจิทัล และการสร้างแบรนด์ได้', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถคิดวิเคราะห์อย่างเป็นระบบแบบองค์รวม สามารถบูรณาการความรู้เพื่อแก้ปัญหาทางธุรกิจและสถานการณ์ทั่วไปได้อย่างเหมาะสม ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์แนวคิด ทฤษฎีทางด้านการตลาดดิจิทัลและการสร้างแบรนด์ได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาที่ซับซ้อนได้อย่างครบถ้วน พร้อมเสนอแนวทางแก้ไขที่สร้างสรรค์ มีประสิทธิภาพสูง และตอบโจทย์ความต้องการของสถานประกอบการได้อย่างสมบูรณ์   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อยแต่ไม่กระทบต่อคุณภาพโดยรวม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้บางส่วน แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข (2)', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์แนวคิด ทฤษฎีทางด้านการตลาดดิจิทัลและการสร้างแบรนด์ ไปเชื่อมโยงกับแนวคิดทางด้านอื่นๆ ในการบริหารจัดการองค์กรและการทำธุรกิจได้ |   5 (ยอดเยี่ยม): วิเคราะห์และเชื่อมโยงกับแนวคิดด้านอื่นๆ ในการบริหารจัดการองค์กรและการทำธุรกิจได้อย่างถูกต้อง ครบถ้วน และแปลผลได้ชัดเจน พร้อมข้อสรุปที่นำไปใช้ได้จริง   4 (ดีมาก): วิเคราะห์และเชื่อมโยงได้ดีในระดับที่เหมาะสม พร้อมข้อสรุปที่เป็นประโยชน์ แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): วิเคราะห์และเชื่อมโยงได้ในระดับพื้นฐาน แต่ข้อสรุปยังขาดความชัดเจนและสมบูรณ์ในบางส่วน   2 (พอใช้): วิเคราะห์และเชื่อมโยงได้เพียงบางส่วน และข้อสรุปยังไม่ชัดเจน ต้องการคำแนะนำเพิ่มเติม   1 (ต้องปรับปรุง): ไม่สามารถวิเคราะห์และเชื่อมโยงหรือแปลผลได้ (3)', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบ คำนึงถึงจริยธรรมและจรรยาบรรณในการประกอบอาชีพด้านการตลาดดิจิทัล และการสร้างแบรนด์และแสดงให้เห็นถึงความมีจิตสำนึกในการรับผิดชอบต่อสังคม |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบอย่างชัดเจน   4 (ดีมาก): ปฏิบัติตามกฎระเบียบส่วนใหญ่ และแสดงความรับผิดชอบในงานได้ดี แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้เทคโนโลยีสารสนเทศต่างๆ และสามารถสื่อสารทั้งภาษาไทยและภาษาต่างประเทศที่จำเป็นในการประกอบอาชีพทางด้านการตลาดดิจิทัล และการสร้างแบรนด์ได้ |   5 (ยอดเยี่ยม): สื่อสารได้ชัดเจน เข้าใจง่าย ใช้ภาษาไทยและภาษาอังกฤษได้อย่างเหมาะสมกับสถานการณ์   4 (ดีมาก): สื่อสารได้ดีในระดับที่เหมาะสม แม้จะมีข้อผิดพลาดเล็กน้อยที่ไม่กระทบต่อการทำงาน   3 (ดี): สื่อสารได้ในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดหรือจุดที่ไม่ชัดเจนในบางสถานการณ์   2 (พอใช้): สื่อสารได้บ้าง แต่ยังไม่เหมาะสมกับสถานการณ์หรือมีข้อผิดพลาดที่ส่งผลต่อการทำงาน   1 (ต้องปรับปรุง): ไม่สามารถสื่อสารได้อย่างเหมาะสมในสถานการณ์จริง', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถคิดวิเคราะห์อย่างเป็นระบบแบบองค์รวม สามารถบูรณาการความรู้เพื่อแก้ปัญหาทางธุรกิจและสถานการณ์ทั่วไปได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): นักศึกษาสามารถคิดวิเคราะห์ได้อย่างเป็นระบบแบบองค์รวม บูรณาการความรู้เพื่อแก้ปัญหาทางธุรกิจและสถานการณ์ทั่วไปได้อย่างรวดเร็วและนำไปประยุกต์ใช้ในงานได้อย่างมีประสิทธิภาพ มีการริเริ่มในการศึกษาข้อมูลเพิ่มเติมด้วยตัวเอง และแสดงผลลัพธ์ที่ชัดเจน   4 (ดีมาก): นักศึกษาสามารถคิดวิเคราะห์ได้อย่างเป็นระบบแบบองค์รวม บูรณาการความรู้เพื่อแก้ปัญหาทางธุรกิจและสถานการณ์ทั่วไปได้ในระดับที่เหมาะสม แม้จะมีการปรับปรุงในบางส่วน   3 (ดี): นักศึกษาสามารถคิดวิเคราะห์ได้อย่างเป็นระบบแบบองค์รวม เรียนรู้ทักษะใหม่ได้ในระดับพื้นฐาน และเริ่มต้นนำไปใช้ในงานบางส่วน แต่ยังขาดความสมบูรณ์   2 (พอใช้): นักศึกษาสามารถเรียนรู้ทักษะใหม่ได้ในระดับที่จำกัด และยังไม่สามารถประยุกต์ใช้ได้อย่างเหมาะสม   1 (ต้องปรับปรุง): นักศึกษาไม่สามารถเรียนรู้ทักษะใหม่ได้ด้วยตนเอง และขาดความพยายามในการพัฒนาตนเอง', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
END $$;

