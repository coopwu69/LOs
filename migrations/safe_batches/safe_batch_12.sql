DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรการตลาดดิจิทัลและการสร้างแบรนด์', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรการตลาดดิจิทัลและการสร้างแบรนด์.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์แนวคิด ทฤษฎีทางด้านการตลาดดิจิทัลและการสร้างแบรนด์ได้อย่างเหมาะสม', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์แนวคิด ทฤษฎีทางด้านการตลาดดิจิทัลและการสร้างแบรนด์ ไปเชื่อมโยงกับแนวคิดทางด้านอื่นๆ ในการบริหารจัดการองค์กรและการทำธุรกิจได้', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบ คำนึงถึงจริยธรรมและจรรยาบรรณในการประกอบอาชีพด้านการตลาดดิจิทัล และการสร้างแบรนด์และแสดงให้เห็นถึงความมีจิตสำนึกในการรับผิดชอบต่อสังคม', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้เทคโนโลยีสารสนเทศต่างๆ และสามารถสื่อสารทั้งภาษาไทยและภาษาต่างประเทศที่จำเป็นในการประกอบอาชีพทางด้านการตลาดดิจิทัล และการสร้างแบรนด์ได้', NULL, 'LO4', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถคิดวิเคราะห์อย่างเป็นระบบแบบองค์รวม สามารถบูรณาการความรู้เพื่อแก้ปัญหาทางธุรกิจและสถานการณ์ทั่วไปได้อย่างเหมาะสม ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULL, 'LO5', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์แนวคิด ทฤษฎีทางด้านการตลาดดิจิทัลและการสร้างแบรนด์ได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาที่ซับซ้อนได้อย่างครบถ้วน พร้อมเสนอแนวทางแก้ไขที่สร้างสรรค์ มีประสิทธิภาพสูง และตอบโจทย์ความต้องการของสถานประกอบการได้อย่างสมบูรณ์   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อยแต่ไม่กระทบต่อคุณภาพโดยรวม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้บางส่วน แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข (2)', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์แนวคิด ทฤษฎีทางด้านการตลาดดิจิทัลและการสร้างแบรนด์ ไปเชื่อมโยงกับแนวคิดทางด้านอื่นๆ ในการบริหารจัดการองค์กรและการทำธุรกิจได้ |   5 (ยอดเยี่ยม): วิเคราะห์และเชื่อมโยงกับแนวคิดด้านอื่นๆ ในการบริหารจัดการองค์กรและการทำธุรกิจได้อย่างถูกต้อง ครบถ้วน และแปลผลได้ชัดเจน พร้อมข้อสรุปที่นำไปใช้ได้จริง   4 (ดีมาก): วิเคราะห์และเชื่อมโยงได้ดีในระดับที่เหมาะสม พร้อมข้อสรุปที่เป็นประโยชน์ แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): วิเคราะห์และเชื่อมโยงได้ในระดับพื้นฐาน แต่ข้อสรุปยังขาดความชัดเจนและสมบูรณ์ในบางส่วน   2 (พอใช้): วิเคราะห์และเชื่อมโยงได้เพียงบางส่วน และข้อสรุปยังไม่ชัดเจน ต้องการคำแนะนำเพิ่มเติม   1 (ต้องปรับปรุง): ไม่สามารถวิเคราะห์และเชื่อมโยงหรือแปลผลได้ (3)', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบ คำนึงถึงจริยธรรมและจรรยาบรรณในการประกอบอาชีพด้านการตลาดดิจิทัล และการสร้างแบรนด์และแสดงให้เห็นถึงความมีจิตสำนึกในการรับผิดชอบต่อสังคม |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบอย่างชัดเจน   4 (ดีมาก): ปฏิบัติตามกฎระเบียบส่วนใหญ่ และแสดงความรับผิดชอบในงานได้ดี แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้เทคโนโลยีสารสนเทศต่างๆ และสามารถสื่อสารทั้งภาษาไทยและภาษาต่างประเทศที่จำเป็นในการประกอบอาชีพทางด้านการตลาดดิจิทัล และการสร้างแบรนด์ได้ |   5 (ยอดเยี่ยม): สื่อสารได้ชัดเจน เข้าใจง่าย ใช้ภาษาไทยและภาษาอังกฤษได้อย่างเหมาะสมกับสถานการณ์   4 (ดีมาก): สื่อสารได้ดีในระดับที่เหมาะสม แม้จะมีข้อผิดพลาดเล็กน้อยที่ไม่กระทบต่อการทำงาน   3 (ดี): สื่อสารได้ในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดหรือจุดที่ไม่ชัดเจนในบางสถานการณ์   2 (พอใช้): สื่อสารได้บ้าง แต่ยังไม่เหมาะสมกับสถานการณ์หรือมีข้อผิดพลาดที่ส่งผลต่อการทำงาน   1 (ต้องปรับปรุง): ไม่สามารถสื่อสารได้อย่างเหมาะสมในสถานการณ์จริง', NULL, 'LO4', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถคิดวิเคราะห์อย่างเป็นระบบแบบองค์รวม สามารถบูรณาการความรู้เพื่อแก้ปัญหาทางธุรกิจและสถานการณ์ทั่วไปได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): นักศึกษาสามารถคิดวิเคราะห์ได้อย่างเป็นระบบแบบองค์รวม บูรณาการความรู้เพื่อแก้ปัญหาทางธุรกิจและสถานการณ์ทั่วไปได้อย่างรวดเร็วและนำไปประยุกต์ใช้ในงานได้อย่างมีประสิทธิภาพ มีการริเริ่มในการศึกษาข้อมูลเพิ่มเติมด้วยตัวเอง และแสดงผลลัพธ์ที่ชัดเจน   4 (ดีมาก): นักศึกษาสามารถคิดวิเคราะห์ได้อย่างเป็นระบบแบบองค์รวม บูรณาการความรู้เพื่อแก้ปัญหาทางธุรกิจและสถานการณ์ทั่วไปได้ในระดับที่เหมาะสม แม้จะมีการปรับปรุงในบางส่วน   3 (ดี): นักศึกษาสามารถคิดวิเคราะห์ได้อย่างเป็นระบบแบบองค์รวม เรียนรู้ทักษะใหม่ได้ในระดับพื้นฐาน และเริ่มต้นนำไปใช้ในงานบางส่วน แต่ยังขาดความสมบูรณ์   2 (พอใช้): นักศึกษาสามารถเรียนรู้ทักษะใหม่ได้ในระดับที่จำกัด และยังไม่สามารถประยุกต์ใช้ได้อย่างเหมาะสม   1 (ต้องปรับปรุง): นักศึกษาไม่สามารถเรียนรู้ทักษะใหม่ได้ด้วยตนเอง และขาดความพยายามในการพัฒนาตนเอง', NULL, 'LO5', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรบริหารธุรกิจบัณฑิต สาขาการจัดการโลจิสติกส์', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'แบบประเมินรายวิชาสหกิจศึกษาตาม LO หลักสูตรการจัดการโลจิสติกส์_ส่ง.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'การประยุกต์ใช้ความรู้ด้านการจัดการโลจิสติกส์ และเครื่องมือทางโลจิสติกส์ ในการทำงาน วางแผนแก้ปัญหาหรือปรับปรุงการทำงาน | ดีเยี่ยม (5 คะแนน) สามารถประยุกต์ใช้ความรู้ในการทำงานได้อย่างโดดเด่น ผลงานมีคุณภาพสูง มีแนวทางในการปรับปรุงงานที่โดดเด่น ตอบสนองความต้องการขององค์กรได้อย่างมีประสิทธิภาพ', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ไม่สามารถประยุกต์ใช้ความรู้ในการทำงาน และ เสนอแนวคิดในการพัฒนางาน', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ทักษะในการทำงานด้านโลจิสติกส์ | ดีเยี่ยม (5 คะแนน) สามารถทำงานได้อย่างมีประสิทธิภาพและเป็นระบบ ทำเสร็จในเวลาที่กำหนดเสมอ', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ไม่สามารถทำงานได้สำเร็จ งานมีความผิดพลาดและไม่แล้วเสร็จตามกำหนดเวลา', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ทักษะการใช้เทคโนโลยีดิจิทัล โปรแกรมสำนักงานระดับสูง และโปรแกรมประยุกต์ทางโลจิสติกส์เพื่อสืบค้น รวบรวมข้อมูล ตลอดจนวิเคราะห์ข้อมูล | ดีเยี่ยม (5 คะแนน) มีทักษะในการใช้เทคโนโลยีดิจิทัลในการทำงานได้อย่างเชี่ยวชาญ สืบค้น/วิเคราะห์ข้อมูลได้อย่างรวดเร็ว ผลงานมีคุณภาพสูง', NULL, NULL, 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ทักษะการใช้เทคโนโลยีดิจิทัลในการทำงานไม่เพียงพอ ผลงานที่ทำไม่ถูกต้องครบถ้วน ไม่ตอบสนองความต้องการขององค์กร', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ทักษะการสื่อสารในการทำงาน | ดีเยี่ยม (5 คะแนน) สามารถสื่อสารและนำเสนอได้ชัดเจน เข้าใจได้ง่าย ใช้ภาษาและสื่อได้อย่างเหมาะสม  มีการโน้มน้าวใจในการสื่อสาร', NULL, NULL, 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ลักษณะบุคคล/สมรรถนะ | ผลการประเมิน', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ความซื่อสัตย์ และการปฏิบัติตามกฎระเบียบขององค์กร | ดีเยี่ยม (5 คะแนน) มีความซื่อสัตย์ ปฏิบัติตามกฎระเบียบขององค์กรอย่างเคร่งครัด', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ขาดความซื่อสัตย์ ไม่ปฏิบัติตามกฎระเบียบ และส่งผลกระทบต่อการทำงาน', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ความรับผิดชอบต่อตนเองและสังคม | ดีเยี่ยม (5 คะแนน) มีความรับผิดชอบสูง ปฏิบัติหน้าที่ได้ดีเยี่ยม และมีส่วนร่วมในการทำประโยชน์แก่สังคมอย่างดีเยี่ยม', NULL, NULL, 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ขาดความรับผิดชอบ ละเลยหน้าที่ ไม่มีส่วนร่วมในการส่งเสริมสังคม', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ภาวะผู้นำ การเป็นทั้งผู้นำและผู้ตามที่ดี และความสามารถในการทำงานร่วมกับผู้อื่น | ดีเยี่ยม (5 คะแนน) มีภาวะความเป็นผู้นำสูง และเป็นผู้ตามที่ดี ยอมรับคำแนะนำและทำงานร่วมกับผู้อื่นอย่างมีประสิทธิภาพ สนับสนุนการทำงานร่วมกันและสร้างบรรยากาศที่ดีในทีม', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'สามารถเป็นผู้นำในบางสถานการณ์ และเป็นผู้ตามได้เมื่อจำเป็น มีความพยายามในการทำงานร่วมกับผู้อื่น แต่ยังขาดความคล่องแคล่วในการประสานงานหรือการรับผิดชอบในบางครั้ง', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ขาดภาวะผู้นำ ทำงานร่วมกับผู้อื่นไม่ดี มีปัญหาด้านการสื่อสารและการประสานงาน', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ใจอาสา | ดีเยี่ยม (5 คะแนน) มีใจอาสา พร้อมที่จะช่วยเหลือผู้อื่นในทุกสถานการณ์', NULL, NULL, 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ขาดความเต็มใจในการช่วยเหลือผู้อื่น และไม่แสดงถึงความตั้งใจในการมีส่วนร่วมในกิจกรรมที่ต้องการความช่วยเหลือ', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'การใฝ่เรียนรู้ | ดีเยี่ยม (5 คะแนน) มีความกระตือรือร้นในการเรียนรู้ พัฒนาทักษะอย่างต่อเนื่อง และนำความรู้ที่ได้ไปใช้ในทางปฏิบัติอย่างมีประสิทธิภาพ', NULL, NULL, 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ขาดความตั้งใจในการเรียนรู้ ไม่มีความสนใจในการหาความรู้ใหม่ ๆ หรือการพัฒนาทักษะ', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'การคิดวิเคราะห์อย่างมีเหตุผลเพื่อแก้ไขปัญหาหรือพัฒนางาน | ดีเยี่ยม (5 คะแนน) มีการคิดวิเคราะห์ที่มีเหตุผล สามารถระบุปัญหาหรือจุดที่ต้องการพัฒนาได้อย่างแม่นยำ และเสนอทางแก้ที่เหมาะสม โดยใช้ข้อมูลและหลักฐานที่มีความชัดเจน นำไปสู่การแก้ไขปัญหาหรือพัฒนางานได้อย่างมีประสิทธิภาพ', NULL, NULL, 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ขาดความสามารถในการคิดวิเคราะห์หรือใช้เหตุผลในการแก้ไขปัญหาหรือพัฒนางาน', 1, 4);
END $$;

