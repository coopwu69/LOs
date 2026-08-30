DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรบัญชีบัณฑิต (ปรับปรุง พ.ศ. 2567)', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา(หลักสูตรบัญชีบัณฑิต-ปรับปรุง-2567).docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้หลักการบัญชี มาตรฐานการรายงานทางการเงิน และศาสตร์ที่เกี่ยวข้องกับวิชาชีพบัญชี ในการปฏิบัติงานสถานประกอบการได้อย่างเหมาะสม', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถวิเคราะห์และแปลผลข้อมูลทางบัญชี เพื่อสนับสนุนการตัดสินใจในสถานประกอบการได้', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ผู้เรียนสามารถสื่อสารด้วยภาษาไทยและภาษาอังกฤษในการปฏิบัติงานบัญชีได้อย่างมีประสิทธิภาพ', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเรียนรู้และพัฒนาทักษะใหม่ที่เกี่ยวข้องกับงานบัญชีด้วยตนเองได้', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบ และคำนึงถึงจรรยาบรรณวิชาชีพบัญชี', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีมได้อย่างมีประสิทธิภาพ และแสดงความเป็นผู้นำ ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้หลักการบัญชี มาตรฐานการรายงานทางการเงิน และศาสตร์ที่เกี่ยวข้องกับวิชาชีพบัญชี ในการปฏิบัติงานสถานประกอบการได้อย่างเหมาะสม | 5 (ยอดเยี่ยม): ประยุกต์ใช้หลักการบัญชีได้อย่างคล่องแคล่ว ถูกต้อง และสร้างสรรค์', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ประยุกต์ใช้หลักการบัญชีได้ดี มีข้อผิดพลาดเล็กน้อยที่ไม่กระทบต่อผลลัพธ์', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ประยุกต์ใช้หลักการบัญชีในระดับพื้นฐาน แต่ขาดความสามารถในการประยุกต์ใช้แบบเจาะจงหรือลึกซึ้ง', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ประยุกต์ใช้หลักการบัญชีได้บางส่วน ต้องการคำแนะนำ และยังขาดความแม่นยำในการปฏิบัติงาน', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถประยุกต์ใช้หลักการบัญชีได้ ยังขาดความรู้พื้นฐานและต้องการเสริมทักษะอย่างมาก (2)', ''), 1, 4);
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถวิเคราะห์และแปลผลข้อมูลทางบัญชี เพื่อสนับสนุนการตัดสินใจในสถานประกอบการได้ | 5 (ยอดเยี่ยม): วิเคราะห์ข้อมูลเชิงลึก สรุปผลชัดเจน และนำเสนออย่างเป็นระบบ', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('วิเคราะห์ข้อมูลได้ดี มีข้อสรุปที่เป็นประโยชน์', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('วิเคราะห์ข้อมูลในระดับพื้นฐานและมีข้อสรุปที่ใช้งานได้', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('วิเคราะห์ข้อมูลได้บางส่วนหรือไม่ครอบคลุม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถวิเคราะห์ข้อมูลได้อย่างถูกต้อง ขาดทักษะการสรุปผลและนำเสนออย่างมีประสิทธิภาพ', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ผู้เรียนสามารถสื่อสารด้วยภาษาไทยและภาษาอังกฤษในการปฏิบัติงานบัญชีได้อย่างมีประสิทธิภาพ | 5 (ยอดเยี่ยม): สื่อสารได้อย่างคล่องแคล่ว ชัดเจน และเหมาะสมกับสถานการณ์', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('สื่อสารได้ดี มีข้อผิดพลาดเล็กน้อยไม่กระทบต่อความเข้าใจ', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('สื่อสารในระดับพื้นฐานที่สามารถเข้าใจได้ แต่ยังขาดความเข้าใจในบางจุด', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('สื่อสารได้บางส่วน มีข้อจำกัดด้านความชัดเจนหรือการใช้ภาษา', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถสื่อสารได้อย่างเหมาะสมในสถานการณ์การทำงาน / ฝึกงาน', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเรียนรู้และพัฒนาทักษะใหม่ที่เกี่ยวข้องกับงานบัญชีด้วยตนเองได้ | 5 (ยอดเยี่ยม): เรียนรู้และพัฒนาทักษะใหม่ได้อย่างรวดเร็ว และประยุกต์ใช้อย่างมีประสิทธิภาพ', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('เรียนรู้และพัฒนาทักษะใหม่ได้ดี มีความเข้าใจเนื้อหา และการใช้งาน', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('เรียนรู้และพัฒนาทักษะในระดับพื้นฐาน แต่ยังขาดการประยุกต์ใช้อย่างมีประสิทธิภาพ', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('เรียนรู้และพัฒนาทักษะได้บางส่วน และต้องการคำแนะนำเพิ่มเติม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถเรียนรู้และพัฒนาทักษะได้ด้วยตนเอง (3)', ''), 1, 4);
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบ และคำนึงถึงจรรยาบรรณวิชาชีพบัญชี | 5 (ยอดเยี่ยม): ปฏิบัติตามจรรยาบรรณอย่างเคร่งครัด เป็นแบบอย่างที่ดี และแสดงความรับผิดชอบสูงสุด', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ปฏิบัติตามจรรยาบรรณได้ดี มีความรับผิดชอบต่อหน้าที่', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ปฏิบัติตามจรรยาบรรณในระดับพื้นฐาน แต่ยังขาดความรอบคอบในบางจุด', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ปฏิบัติตามจรรยาบรรณได้บางส่วน และต้องการคำแนะนำเพิ่มเติม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่ปฏิบัติตามจรรยาบรรณ หรือขาดความรับผิดชอบในงาน (4)', ''), 1, 4);
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีมได้อย่างมีประสิทธิภาพ และแสดงความเป็นผู้นำ | 5 (ยอดเยี่ยม): เป็นผู้นำที่ดี ทำงานเป็นทีมอย่างมีประสิทธิภาพสูง และสามารถแก้ปัญหาที่ซับซ้อนได้อย่างเป็นระบบ', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ทำงานเป็นทีมได้ดี มีความรับผิดชอบ แสดงบทบาทผู้นำได้ดีในสถานการณ์ทั่วไป', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ทำงานเป็นทีมในระดับพื้นฐาน แต่ยังขาดความเป็นผู้นำที่ชัดเจน และยังต้องการพัฒนาทักษะในด้านการประสานงาน', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ทำงานเป็นทีมได้บางส่วน ยังต้องการคำแนะนำในการปรับปรุงตนเองและการสร้างความสัมพันธ์ในทีม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถทำงานเป็นทีมได้ หรือหลีกเลี่ยงความรับผิดชอบ', ''), 1, 4);
END $$;

