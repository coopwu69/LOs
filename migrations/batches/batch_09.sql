DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรเทคโนโลยีสารสนเทศอัจฉริยะ', NULLIF('-', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.96, true
  FROM public.assessment_source_documents sd WHERE sd.filename = '3.ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษาหลักสูตรเทคโนโลยีสารสนเทศอัจฉริยะ (IIT).pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้เครื่องมือทางด้าน 5 (ยอดเยี่ยม): ใช้เครื่องมือได้อย่างถูกต้องครบถ้วน ปัญญาประดิษฐ์หรือการวิเคราะห์ข้อมูล หรือพัฒนา พร้อมแสดงผลลัพธ์ที่ชัดเจนและมีประสิทธิภาพสูง แอปพลิเคชันอัจฉริยะได้อย่างเหมาะสมในงานที่ได้รับ', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('ใช้เครื่องมือได้ดีในระดับที่เหมาะสม แม้จะ มอบหมาย มีข้อผิดพลาดเล็กน้อยแต่ไม่กระทบต่อการทำงาน', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('ใช้เครื่องมือได้ในระดับพื้นฐาน แต่ยังขาดความ สมบูรณ์หรือการใช้งานที่ลึกซึ้ง', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('ใช้เครื่องมือได้ในบางส่วน แต่ยังต้องการ คำแนะนำและการปรับปรุง', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถใช้เครื่องมือได้อย่าง ถูกต้อง', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถวิเคราะห์และแก้ไขปัญหาที่ 5 (ยอดเยี่ยม): วิเคราะห์ปัญหาได้อย่างละเอียดและ ซับซ้อนในงานที่เกี่ยวข้องกับเทคโนโลยีสารสนเทศ แก้ไขได้อย่างมีประสิทธิภาพ พร้อมเสนอแนวทางที่ โดยใช้กระบวนการคิดวิเคราะห์ที่มีแบบแผน สร้างสรรค์', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('วิเคราะห์ปัญหาได้ดี และสามารถแก้ไขได้ ในระดับที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อย', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('วิเคราะห์ปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ขาดความสมบูรณ์ในรายละเอียด', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('วิเคราะห์ปัญหาได้บางส่วน แต่ไม่สามารถ แก้ไขได้อย่างเหมาะสม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถวิเคราะห์หรือแก้ไข ปัญหาได้', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารภาษาไทยและ 5 (ยอดเยี่ยม): สื่อสารได้อย่างชัดเจนและตรงประเด็น ภาษาอังกฤษ หรือภาษาจีน ในการรายงานผลการ ทั้งการพูด ฟัง อ่าน เขียน และการนำเสนอ ปฏิบัติงานและการนำเสนอผลงานได้อย่างมี', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('สื่อสารได้ดีในระดับที่เหมาะสม แม้จะมี ประสิทธิภาพ ข้อผิดพลาดเล็กน้อย', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('สื่อสารได้ในระดับพื้นฐาน แต่ยังขาดความ ชัดเจนหรือความมั่นใจในบางส่วน', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('สื่อสารได้ในบางส่วน แต่ยังไม่สามารถ สื่อสารได้ครบถ้วน', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ไม่สามารถสื่อสารได้อย่างมี ประสิทธิภาพ (3)', ''), 1, 4);
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถแสดงความซื่อสัตย์ มีความ 5 (ยอดเยี่ยม): แสดงออกถึงความซื่อสัตย์และ กตัญญ ู ความรับผิดชอบ และปฏิบัติตามกฎระเบียบ จริยธรรมในทุกสถานการณ์ พร้อมทั้งปฏิบัติตาม ของสถานประกอบการ รวมถึงมีจริยธรรมในการใช้ กฎระเบียบของสถานประกอบการอย่างเคร่งครัด เทคโนโลยีสารสนเทศ', NULLIF('', ''), NULLIF('LO7', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('มีจริยธรรมในการปฏิบัติงานในระดับที่ดี แม้มีข้อผิดพลาดเล็กน้อย', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('แสดงจริยธรรมในระดับพื้นฐาน แต่ยังขาด ความสม่ำเสมอ', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('แสดงจริยธรรมในบางส่วน แต่ยังต้องการ คำแนะนำเพิ่มเติม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ขาดจริยธรรมในการปฏิบัติงาน (4)', ''), 1, 4);
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถแสดงความสามารถในการเรียนรู้ 5 (ยอดเยี่ยม): แสดงความสามารถในการเรียนรู้และ ด้วยตนเอง คิดริเริ่ม และวางแผนการทำงานให้ คิดริเริ่มได้อย่างสร้างสรรค์ พร้อมวางแผนและ สอดคล้องกับการเปลี่ยนแปลงในยุคดิจิทัล ประเมินผลการทำงานได้อย่างสมบูรณ์', NULLIF('', ''), NULLIF('LO8', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('มีความสามารถในการเรียนรู้ด้วยตนเองใน ระดับที่ดี แม้มีข้อบกพร่องในรายละเอียดเล็กน้อย', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('แสดงความสามารถในการเรียนรู้ด้วยตนเองใน ระดับพื้นฐาน แต่ยังขาดความลึกซึ้งในกระบวนการ', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('เรียนรู้ด้วยตนเองในบางส่วน แต่ยัง ต้องการคำแนะนำเพิ่มเติม', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ขาดความสามารถในการเรียนรู้ หรือวางแผนการทำงาน', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานร่วมกับผู้อื่นได้อย่างมี 5 (ยอดเยี่ยม): มีวินัยและภาวะผู้นำที่โดดเด่น ประสิทธิภาพ ทั้งในฐานะผู้นำและผู้ตาม และมีจิต สามารถทำงานร่วมกับผู้อื่นได้อย่างราบรื่น และแสดง อาสาในการทำงานเพื่อประโยชน์ของสังคม จิตอาสาในการช่วยเหลือทีม', NULLIF('', ''), NULLIF('LO9', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('', ''), NULLIF('มีวินัยและภาวะผู้นำในระดับที่ดี แม้มี ข้อผิดพลาดเล็กน้อย', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('', ''), NULLIF('แสดงวินัยและภาวะผู้นำในระดับพื้นฐาน แต่ยัง ขาดการปรับตัวในบางสถานการณ์', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('', ''), NULLIF('มีวินัยและภาวะผู้นำในบางส่วน แต่ยัง ต้องการการพัฒนาความมั่นใจและความร่วมมือ', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULLIF('', ''), NULLIF('ขาดวินัยและภาวะผู้นำ ส่งผลต่อ การทำงานร่วมกันในทีม', ''), 1, 4);
END $$;

