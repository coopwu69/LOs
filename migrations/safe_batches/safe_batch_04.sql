DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรเทคโนโลยีสารสนเทศอัจฉริยะ', '-', 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.96, true
  FROM public.assessment_source_documents sd WHERE sd.filename = '3.ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษาหลักสูตรเทคโนโลยีสารสนเทศอัจฉริยะ (IIT).pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถใช้เครื่องมือทางด้าน 5 (ยอดเยี่ยม): ใช้เครื่องมือได้อย่างถูกต้องครบถ้วน ปัญญาประดิษฐ์หรือการวิเคราะห์ข้อมูล หรือพัฒนา พร้อมแสดงผลลัพธ์ที่ชัดเจนและมีประสิทธิภาพสูง แอปพลิเคชันอัจฉริยะได้อย่างเหมาะสมในงานที่ได้รับ', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ใช้เครื่องมือได้ดีในระดับที่เหมาะสม แม้จะ มอบหมาย มีข้อผิดพลาดเล็กน้อยแต่ไม่กระทบต่อการทำงาน', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ใช้เครื่องมือได้ในระดับพื้นฐาน แต่ยังขาดความ สมบูรณ์หรือการใช้งานที่ลึกซึ้ง', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ใช้เครื่องมือได้ในบางส่วน แต่ยังต้องการ คำแนะนำและการปรับปรุง', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถใช้เครื่องมือได้อย่าง ถูกต้อง', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถวิเคราะห์และแก้ไขปัญหาที่ 5 (ยอดเยี่ยม): วิเคราะห์ปัญหาได้อย่างละเอียดและ ซับซ้อนในงานที่เกี่ยวข้องกับเทคโนโลยีสารสนเทศ แก้ไขได้อย่างมีประสิทธิภาพ พร้อมเสนอแนวทางที่ โดยใช้กระบวนการคิดวิเคราะห์ที่มีแบบแผน สร้างสรรค์', NULL, 'LO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'วิเคราะห์ปัญหาได้ดี และสามารถแก้ไขได้ ในระดับที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อย', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'วิเคราะห์ปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ขาดความสมบูรณ์ในรายละเอียด', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'วิเคราะห์ปัญหาได้บางส่วน แต่ไม่สามารถ แก้ไขได้อย่างเหมาะสม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถวิเคราะห์หรือแก้ไข ปัญหาได้', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารภาษาไทยและ 5 (ยอดเยี่ยม): สื่อสารได้อย่างชัดเจนและตรงประเด็น ภาษาอังกฤษ หรือภาษาจีน ในการรายงานผลการ ทั้งการพูด ฟัง อ่าน เขียน และการนำเสนอ ปฏิบัติงานและการนำเสนอผลงานได้อย่างมี', NULL, 'LO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'สื่อสารได้ดีในระดับที่เหมาะสม แม้จะมี ประสิทธิภาพ ข้อผิดพลาดเล็กน้อย', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'สื่อสารได้ในระดับพื้นฐาน แต่ยังขาดความ ชัดเจนหรือความมั่นใจในบางส่วน', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'สื่อสารได้ในบางส่วน แต่ยังไม่สามารถ สื่อสารได้ครบถ้วน', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถสื่อสารได้อย่างมี ประสิทธิภาพ (3)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถแสดงความซื่อสัตย์ มีความ 5 (ยอดเยี่ยม): แสดงออกถึงความซื่อสัตย์และ กตัญญ ู ความรับผิดชอบ และปฏิบัติตามกฎระเบียบ จริยธรรมในทุกสถานการณ์ พร้อมทั้งปฏิบัติตาม ของสถานประกอบการ รวมถึงมีจริยธรรมในการใช้ กฎระเบียบของสถานประกอบการอย่างเคร่งครัด เทคโนโลยีสารสนเทศ', NULL, 'LO7', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'มีจริยธรรมในการปฏิบัติงานในระดับที่ดี แม้มีข้อผิดพลาดเล็กน้อย', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'แสดงจริยธรรมในระดับพื้นฐาน แต่ยังขาด ความสม่ำเสมอ', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'แสดงจริยธรรมในบางส่วน แต่ยังต้องการ คำแนะนำเพิ่มเติม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ขาดจริยธรรมในการปฏิบัติงาน (4)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถแสดงความสามารถในการเรียนรู้ 5 (ยอดเยี่ยม): แสดงความสามารถในการเรียนรู้และ ด้วยตนเอง คิดริเริ่ม และวางแผนการทำงานให้ คิดริเริ่มได้อย่างสร้างสรรค์ พร้อมวางแผนและ สอดคล้องกับการเปลี่ยนแปลงในยุคดิจิทัล ประเมินผลการทำงานได้อย่างสมบูรณ์', NULL, 'LO8', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'มีความสามารถในการเรียนรู้ด้วยตนเองใน ระดับที่ดี แม้มีข้อบกพร่องในรายละเอียดเล็กน้อย', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'แสดงความสามารถในการเรียนรู้ด้วยตนเองใน ระดับพื้นฐาน แต่ยังขาดความลึกซึ้งในกระบวนการ', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'เรียนรู้ด้วยตนเองในบางส่วน แต่ยัง ต้องการคำแนะนำเพิ่มเติม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ขาดความสามารถในการเรียนรู้ หรือวางแผนการทำงาน', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานร่วมกับผู้อื่นได้อย่างมี 5 (ยอดเยี่ยม): มีวินัยและภาวะผู้นำที่โดดเด่น ประสิทธิภาพ ทั้งในฐานะผู้นำและผู้ตาม และมีจิต สามารถทำงานร่วมกับผู้อื่นได้อย่างราบรื่น และแสดง อาสาในการทำงานเพื่อประโยชน์ของสังคม จิตอาสาในการช่วยเหลือทีม', NULL, 'LO9', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'มีวินัยและภาวะผู้นำในระดับที่ดี แม้มี ข้อผิดพลาดเล็กน้อย', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'แสดงวินัยและภาวะผู้นำในระดับพื้นฐาน แต่ยัง ขาดการปรับตัวในบางสถานการณ์', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'มีวินัยและภาวะผู้นำในบางส่วน แต่ยัง ต้องการการพัฒนาความมั่นใจและความร่วมมือ', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ขาดวินัยและภาวะผู้นำ ส่งผลต่อ การทำงานร่วมกันในทีม', 1, 4);
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรสารสนเทศศาสตรบณั ฑิต', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.85, true
  FROM public.assessment_source_documents sd WHERE sd.filename = '4.หลักสูตรดิจิทัลคอนเทนต์และสื่อ.pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': อธิบายความรู้ด้านมนุษยศาสตร์ 5 (ยอดเยี่ยม): บูรณาการความรู้ทุกด้านมาสร้าง สังคมศาสตร์ทั่วไป เทคโนโลยีสารสนเทศพื้นฐาน ดิจิทลั คอนเทนต์ที่ตอบโจทย์ผู้ใช้ได้ นำเสนอแนวคิดได้ และแนวคิดสำหรับการออกแบบ ผลิต และ อย่างครบถ้วนชัดเจน เผยแพร่ดิจิทัลคอนเทนต์ที่ตอบสนองความต้องการ', NULL, 'PLO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ประยุกต์ใช้ความรู้ได้อย่างเหมาะสม ผลิต ของผู้ใช ้ คอนเทนต์ที่มีคุณภาพดี ตรงความต้องการนผู้ใช้ แต่ยัง ขาดความโดนเด่นด้านนวัตกรรม', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ใชค้ วามรู้พื้นฐานไดถ้ ูกต้อง สร้างคอนเทนต์ได้ ตามมาตรฐาน แต่ยังต้องปรบั ปรุงการตอบสนองความ ต้องการผู้ใช้', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'เข้าใจหลักการพื้นฐาน แต่ประยุกต์ใช้ได้ จำกัด ผลงานยังไม่สมบูรณ์ ต้องได้รับคำแนะนำบ่อยครั้ง', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ขาดความเข้าใจพื้นฐาน ไม่ สามารถนำความรู้มาใช้ได้อย่างเหมาะสม ผลงานไม่ผ่าน เกณฑ์มาตฐาน', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ประยุกต์ใช้ความรู้ด้านการจัดการ 5 (ยอดเยี่ยม): ระบุความต้องการในการดำเนินงาน สารสนเทศ การออกแบบและผลิตสื่อ การ ขององค์กรได้ สามารถออกแบบกระบวนการทำงานที่ จัดบริการดิจิทัลคอนเทนต์ และความรู้ในการ แก้ปัญหาขององค์กร ใช้ความรู้จากรายวิชาเพื่อแก้ปัญหา ประกอบอาชีพด้านการพัฒนาการเรียนแบบ ในการทำงาน สามารถผลิตชนิ้ งานหรือบริการตามที่ได้รับ ออนไลน์ หรือ คอนเทนต์เพื่อการตลาดดิจิทัล หรือ มอบหมาย สรา้ งนวัตกรรมด้านบริหารให้กับองค์กร ดิจิทัลคอลเล็กชัน หรือ เทคโนโลยีเพื่อการจัดการ', NULL, 'PLO2', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ระบุความต้องการในการดำเนินงานของ คอนเทนต์ เพื่อตอบสนองความต้องการของ ผู้ประกอบการในอุตสาหกรรมดิจิทัล องค์กรได้ สามารถออกแบบกระบวนการทำงานที่ แก้ปัญหาขององค์กร ใช้ความรู้จากรายวิชาเพื่อแก้ปัญหา ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ ในการทำงาน สามารถผลิตชนิ้ งานหรือบริการตามที่ได้รับ มอบหมาย', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ระบุความต้องการในการดำเนินงานของ องค์กรได้ สามารถออกแบบกระบวนการทำงานที่ แก้ปัญหาขององค์กร ใช้ความรู้จากรายวิชาเพื่อแก้ปัญหา ในการทำงาน', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ระบุความต้องการในการดำเนินงานของ องค์กรได้ สามารถออกแบบกระบวนการทำงานที่ แก้ปัญหาขององค์กร', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ระบุความต้องการในการ ดำเนินงานขององค์กรได้ (2)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': เลือกใช้เทคโนโลยีเพื่อการพัฒนาดิจิทัล 5 (ยอดเยี่ยม): สามารถใช้งานโปรแกรมหรือ คอนเทนต์ที่ตอบสนองวัตถุประสงค์การใช้งานของ เทคโนโลยเี พื่อการพัฒนาดิจิทัลคอนเทนต์ได้อย่าง ผู้ใช้ สร้างสรรค์ สอดคล้องตามวัตถุประสงค์การใช้งานอย่าง ถูกต้องและมีประสิทธิภาพ', NULL, 'PLO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'เลือกใช้งานโปรแกรมหรือเทคโนโลยีเพื่อ การพัฒนาดิจิทัลคอนเทนต์ได้ดี สอดคล้องตาม วัตถุประสงค์การใช้งาน สามารถปรบั ปรุงบางส่วนเพื่อเพิ่ม ประสิทธิภาพได้ดี', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'เลอื กใช้งานโปรแกรมหรือเทคโนโลยีเพื่อการ พัฒนาดิจิทัลคอนเทนต์ได ้ ตอบโจทย์วัตถุประสงค์ได้เพียง บางส่วน มีความคิดสร้างสรรค์ในระดับพื้นฐานและ แก้ปัญหาได้เพียงบางกรณี ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'เลือกใช้งานโปรแกรมหรือเทคโนโลยีเพื่อ การพัฒนาดิจิทัลคอนเทนต์ไดเ้ ป็นบางงาน ทำให้เกิด ข้อจำกัดในการทำงาน ขาดความคิดสร้างสรรค์และการ แก้ปัญหาที่เหมาะสม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่เลอื กใช้งานโปรแกรมหรือ เทคโนโลยีเพื่อการพัฒนาดิจิทัลคอนเทนต์ได้ ขาด ความคิดสร้างสรรค์และการแก้ปัญหาที่เหมาะสม', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ออกแบบการจัดบริการดิจิทัลคอนเทนต์อ 5 (ยอดเยี่ยม): ออกแบบบรกิ ารนดิจิทัลคอนเทนต ์ ย่างเป็นระบบ โดยใช้กระบวนการวิจัยและพัฒนา อย่างเป็นระบบครบถ้วน เพื่อรองรับการเปลี่ยนแปลงทางดิจิทัลขององค์กร', NULL, 'PLO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ออกแบบบรกิ ารนดิจิทัลคอนเทนต ์ อย่าง เป็นระบบ', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ออกแบบบริการได้อย่างมีโครงสร้างพื้นฐานที่ ชัดเจน', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ออกแบบได้ในระดับพื้นฐาน แต่ขาดความ เป็นระบบ', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไมส่ ามารถออกแบบบริการดิจิทัล คอนเทนต์ได ้', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะในการจัดระบบบริการดิจิทัลคอน 5 (ยอดเยี่ยม): สามารถจัดระบบบริการได้อย่าง เทนต์ให้สอดคล้องกับความต้องการขององค์กร สมบูรณ์และเป็นระบบ สอดคล้องกับความต้องการของ องค์กรอย่างชัดเจน พร้อมทงั้ มีความสามารถในการ ปรับปรุงระบบให้เหมาะสมกบั บริบทที่เปลยี่ นแปลง', NULL, 'PLO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'สามารถจัดระบบบริการได้อย่างสมบรู ณ์ และเป็นระบบ และครอบคลุมสอดคล้องกับความต้องการ ขององค์กรได้ในระดับที่ด ี ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'สามารถจัดระบบบริการได้อย่างมีโครงสร้างส พื้นฐาน สอดคล้องกับความต้องการขององค์กรในบางส่วน แต่ยังมีจุดที่ต้องปรับปรุง', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'สามารถจัดระบบบริการได้ในระดับ เบื้องต้น แต่ยังขาดความสอดคล้องกับความต้องการของ องค์กร', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไมม่ ีความสามารถในการจัดระบบ บริการดิจิทลั คอนเทนต์ได้อย่างเหมาะสม', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการสื่อสารภาษาไทยและ 5 (ยอดเยี่ยม): มีทักษะการสื่อสารภาษาไทยและ ภาษาอังกฤษ เพื่อใช้ในชีวิตประจำวัน ทั้งการฟัง ภาษาอังกฤษที่โดดเด่น สื่อสารได้อย่างคล่องแคล่ว พูด อ่าน เขียน และเสนอผลงานได้ตาม ถูกต้อง และมปี ระสิทธิภาพในทุกสถานการณ์ประจำวัน วัตถุประสงค์ ในกรณีที่นักศึกษาเลือกภาษาจีน', NULL, 'PLO6', 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'มีทักษะการสอื่ สารภาษาไทยได้อย่าง สามารถสื่อสารภาษาจีนในชีวิตประจำวันได ้ ถูกต้อง สามารถสื่อสารภาษาอังกฤษได้ในระดับดี ทั้งการ ฟัง พูด อ่าน เขียน ในสถานการณ์ประจำวัน', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'มีทักษะการสื่อสารภาษาไทยที่ดี และ สามารถใช้ภาษาอังกฤเพื่อการฟัง พูด อ่าน เขียนใน ระดับพื้นฐาน สื่อสารภาษาอังกฤษได้ในสถานการณ์ทั่วไป แต่ยังมีข้อผิดพลาดในโครงสร้างหรือการเลือกใช้คำ', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'สามารถสื่อสารภาษาไทยได้ใน ระดับพื้นฐาน การใช้ภาษาองั กฤษยังมีข้อจำกัด เช่น การ สื่อสารคำศัพทง์ ่ายๆ เท่านั้น', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ขาดทักษะในการฟงั พูด อ่าน เขียน ทั้งภาษาไทยและภาษาอังกฤษณ ไม่สามารถสื่อสาร ในสถานการณป์ ระจำวันได้ ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ (3)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงความซื่อสัตย์ ความกตัญญู 5 (ยอดเยี่ยม): ปฏิบัติงานด้วยความซื่อสตั ย์สุจริต กตเวที ความรับผิดชอบต่อตนเองและสังคม ปฏิบัติ แสดงจิตอาสาและช่วยเหลืองานขององค์กร รับผิดชอบ ตามกฎระเบียบ และปฏิบัติตนอย่างถูกต้องตาม งานให้แล้วเสรจ็ ตรงเวลา แก้ปัญหาในการทำงานได้ด้วย จริยธรรมทางวิชาการ ตนเอง ปฏิบัติตามกฎระเบียบขององค์กร', NULL, 'PLO7', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ปฏิบัติงานด้วยความซื่อสตั ยส์ ุจริต แสดง จิตอาสาและช่วยเหลืองานขององค์กร รับผิดชอบงานให้ แล้วเสร็จตรงเวลา แก้ปัญหาในการทำงานได้ด้วยตนเอง', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'ปฏิบัติงานด้วยความซื่อสตั ย์สุจริต แสดงจิต อาสาและช่วยเหลืองานขององค์กร รับผิดชอบงานให้แล้ว เสร็จตรงเวลา', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'ปฏิบัติงานด้วยความซื่อสตั ยส์ ุจริต แสดง จิตอาสาและช่วยเหลืองานขององค์กร', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ปฏิบัติงานด้วยความซื่อสตั ย์สุจริต (4)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการมีภาวะผู้นำ มีสุขภาวะ 5 (ยอดเยี่ยม): แสดงความเป็นผู้นำได้อย่างชัดเจนใน สามารถเป็นได้ทั้งผู้นำและผู้ตาม มีจิตอาสาและ ทุกสถานการ์ มีการตัดสินใจอย่างเหมาะสม และสร้าง ทำงานร่วมกับผู้อื่น แรงจูงใจให้กับทีม', NULL, 'PLO8', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'มีความสามารถในการเป็นผนู้ ำได้ดีใน สถานการณ์ส่วนใหญ่ แต่ยังมจี ุดที่ต้องพัฒนา', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'แสดงบทบามผู้นำได้ในบางสถานการณ์ แต่ ยังขาดความมั่นใจหรือประสทิ ธิภาพ ผลลัพธ์การเรยี นรู้ทคี่ าดหวงั ผลการประเมนิ', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'มีความยากลำบากในการแสดงบทบาท ผู้นำ และต้องการคำแนะนำเพิ่มเติม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไมส่ ามารถแสดงบทบาทผู้นำได้ หรือหลีกเลี่ยงการรับผิดชอบ', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการรู้ดิจิทัล สามารถแสวงหา 5 (ยอดเยี่ยม): สามารถค้นหาและเข้าถูกข้อมูลได้ ความรู้ภายใต้สภาพแวดล้อมดิจิทัล อย่างรวดเร็วและมีประสิทธิภาพ โดยใช้เครื่องมือดิจิทัลที่ หลากหลาย', NULL, 'PLO9', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'ค้นหาและเขา้ ถึงข้อมูลได้ดี โดยใช้ เครื่องมือมที่เหมาะสม', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ด', NULL, 'ี : สามารถค้นหาข้อมูลได้ในระดับพื้นฐาน แต่ ต้องการคำแนะนำเพิ่มเติม', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'มีความยากลำบากในการค้นหาข้อมูลและ ใช้งานเครื่องมือได้อย่างจำกัด', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรงุ', NULL, 'ไมส่ ามารถค้นหาและเข้าถึงข้อมูล ได้ด้วยตนเอง', 1, 4);
END $$;

