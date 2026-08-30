
DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'The learning outcomes of cooperative education subject – English Program', 'Apply knowledge of English to perform tasks in the workplace.', 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.91, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'LOs Coop Ed_English_8 Dec 2024.pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้องค์ความรู้ด้านภาษาอังกฤษเพื่อ ระดับดีเยี่ยม (ประยุกต์ใช้ความรู้ภาษาอังกฤษใน ปฏิบัติงานในสถานประกอบการได้ การปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการ Apply knowledge of English to perform tasks ไดอ้ ย่างมปี ระสิทธิภาพ ถูกต้องและเหมาะสม) in the workplace. ระดับดีมาก (ประยุกต์ใช้ความรู้ภาษาอังกฤษใน การปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการ ไดอ้ ย่างมีประสิทธิภาพ แต่ยังมีข้อผิดพลาดบ้าง) ระดับดี (ประยุกต์ใช้ความรู้ภาษาอังกฤษในการ ปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการได้ พอสมควร และยังมีข้อผิดพลาดอยู่บ้าง) ระดับพอใช้ (ประยุกต์ใช้ความรู้ภาษาอังกฤษใน การปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการ ได้เพียงเล็กน้อย และยังมีข้อผิดพลาดเป็นส่วนใหญ่) ระดับควรปรับปรุง (ไม่สามารถประยุกต์ใช้ความรู้ ภาษาอังกฤษในการปฏิบัติงานที่ได้รับมอบหมายใน สถานประกอบการได้)', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้ความรู้เฉพาะด้านในสาขาวิชาชีพที่ ระดับดีเยี่ยม (ประยุกต์ใช้ความรู้เฉพาะด้านใน เกี่ยวข้องกับลักษณะงานในสถานประกอบการได้ การปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการ Apply specialized knowledge in a professional ได้อย่างมีประสิทธิภาพ ถูกต้องและเหมาะสม) field relevant to the specific nature of work in the workplace. ระดับดีมาก (ประยุกต์ใช้ความรู้เฉพาะด้านในการ ประยุกต์ใช้ความรู้เฉพาะด้านในการปฏิบัติงานที่ได้รับ ปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการได้ มอบหมายในสถานประกอบการอย่างมีประสิทธิภาพ อย่างมีประสิทธิภาพ แต่ยังมีข้อผิดพลาดบ้าง) ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน ระดับดี (ประยุกต์ใช้ความรู้เฉพาะด้านในการ ปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการได้ พอสมควร และยังมีข้อผิดพลาดอยู่บ้าง) ระดับพอใช้ (ประยุกต์ใช้ความรู้เฉพาะด้านในการ ปฏิบัติงานที่ได้รับมอบหมายในสถานประกอบการได้ เพียงเล็กน้อย และยังมีข้อผิดพลาดเป็นส่วนใหญ่) ระดับควรปรับปรุง (ไม่สามารถประยุกต์ใช้ความรู้ เฉพาะด้านในการปฏิบัติงานที่ได้รับมอบหมายในสถาน ประกอบการได)้', NULL, 'LO2', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการสื่อสารภาษาอังกฤษในบริบทของ ระดับดีเยี่ยม (สื่อสารและน าเสนอโดยใช้ การท างาน และการน าเสนอผลงานในที่สาธารณะที่ ภาษาอังกฤษได้อย่างคล่องแคล่ว เนื้อหาครบถ้วน และ เกี่ยวข้องกับการประกอบอาชีพ ตอบค าถามได้ทุกประเด็น) Employ English communication skills in work contexts and public presentations related to ระดับดีมาก (สื่อสารและน าเสนอโดยใช้ professional practice. ภาษาอังกฤษได้อย่างคล่องแคล่ว แต่อาจติดขัดบ้าง เนื้อหาครบถ้วนเป็นส่วนใหญ่ และตอบค าถามได้เกือบ ทุกประเด็น) ระดับดี (สื่อสารและน าเสนอโดยใช้ภาษาอังกฤษ ไดค้ ล่องแคล่วเป็นส่วนใหญ่ เนื้อหาบางส่วนขาด หายไป และตอบค าถามได้บางประเด็น) ระดับพอใช้ (สื่อสารและน าเสนอโดยใช้ ภาษาอังกฤษไม่คล่องแคล่ว เนื้อหาส่วนใหญ่ขาด หายไป และตอบค าถามได้น้อยมาก) ระดับควรปรับปรุง (ไม่สามารถสื่อสารและ น าเสนอโดยใช้ภาษาอังกฤษได้อย่างคล่องแคล่ว เนื้อหาไม่ครบถ้วน และไม่สามารถตอบค าถามได)้ ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการใช้เทคโนโลยียุคดิจิทัล ในการ ระดับดีเยี่ยม (ใช้เทคโนโลยีเพื่อการปฏิบัติงานได้ ค้นคว้าข้อมูล คัดกรอง รวบรวมองค์ความรู้ เพื่อ อย่างมปี ระสิทธิภาพ) ปฏิบัติงานในสถานประกอบการ Utilize digital technology skills for researching, ระดับดีมาก (ใช้เทคโนโลยีเพื่อการปฏิบัติงานได้ filtering, and compiling knowledge to perform อย่างดี) tasks in the workplace. ระดับดี (ใช้เทคโนโลยีเพื่อปฏิบัติงานได้ในประดับ ปานกลาง) ระดับพอใช้ (ใช้เทคโนโลยีเพื่อปฏิบัติงานได้ใน ระดับเบื้องต้น) ระดับควรปรับปรุง (ขาดความรู้ในการใช้ เทคโนโลยีเพื่อปฏิบัติงาน)', NULL, 'LO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการคิด วิเคราะห์ และการใช้เหตุผล ระดับดีเยี่ยม (มีการคิด วิเคราะห์ หรือใช้เหตุผล เพื่อพัฒนา แก้ปัญหา หรือเพิ่มพูนความรู้ที่เกี่ยวข้อง เพื่อพัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่เกี่ยวข้องกับ กับสถานประกอบการ สถานประกอบการได้ทั้งหมด) Develop skills in critical thinking, analysis, and reasoning to improve, solve problems, or ระดับดีมาก (มีการคิด วิเคราะห์ หรือใช้เหตุผล enhance knowledge related to the เพื่อพัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่เกี่ยวข้องกับ workplace. สถานประกอบการได้เป็นส่วนใหญ่) ระดับดี (มีการคิด วิเคราะห์ หรือใช้เหตุผลเพื่อ พัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่เกี่ยวข้องกับ สถานประกอบการได้พอสมควร) ระดับพอใช้ (มีการคิด วิเคราะห์ หรือใช้เหตุผล เพื่อพัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่เกี่ยวข้องกับ สถานประกอบการไดบ้ ้าง) ระดับควรปรับปรุง (ขาดการคิด วิเคราะห์ หรือใช้ เหตุผลเพื่อพัฒนา แก้ปัญหาหรือเพิ่มพูนความรู้ที่ เกี่ยวข้องกับสถานประกอบการ)', NULL, 'LO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงความกตัญญู รับผิดชอบ ซื่อสัตย์ ตรงเวลา และไม่ละเมิดจรรยาบรรณทางวิชาการและ วิชาชีพ Express gratitude, responsibility, honesty, punctuality, and commitment to academic and professional ethics.', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงการมีทัศนคติเปิดกว้าง ยอมรับ ความแตกต่างและการเปลี่ยนแปลง มีวินัย สามารถ ปรับตัวและร่วมงานกับผู้อื่นได้ Demonstrate an open-minded attitude, acceptance of differences and changes, discipline, adaptability, and teamwork skills.', NULL, 'LO7', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, '(Program Learning Outcome: PLO)', '1', 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'LOs-ของรายวิชาสหกิจศึกษา-67-ไทยเพื่อการสื่อสาร.pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้องค์ความรู้ด้าน', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', 'Excellent', 'มนุษยศาสตร์ สังคมศาสตร์ โดยเฉพาะด้าน สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ ภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย การสร้างสรรค์เนื้อหา ด้านงานเขียน งาน เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ ประชาสัมพันธ์ หรืองานวิชาการเพื่อการ งานวิชาการที่ได้รับมอบหมายในสถานประกอบการได้ ปฏิบัติงานในสถานประกอบการ อย่างโดดเด่น ผลงานมีคุณภาพสูง ชัดเจน และสามารถ ตอบสนองความต้องการขององค์กรได้อย่างมีประสิทธิภาพ', 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', 'สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ งานวิชาการที่ได้รับมอบหมายในสถานประกอบการได้ดี ผลงานมีความสมบูรณ์ และสามารถใช้งานได้จริงในองค์กร', 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ งานวิชาการที่ได้รับมอบหมายได้ แต่ยังต้องได้รับคําแนะนํา หรือการดูแลบางครั้งจากพี่เลี้ยงหรือผู้เกี่ยวข้อง', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', 'สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ งานวิชาการที่ได้รับมอบหมายได้ในระดับพื้นฐาน แต่ต้องมี การดูแลอย่างใกล้ชิดจากพี่เลี้ยงหรือผู้นิเทศ', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ไม่สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ งานวิชาการที่ได้รับมอบหมายได้ 3 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน', 1, 5);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้องค์ความรู้ด้านภาษาไทย', NULL, 'LO2', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', 'Excellent', 'เพื่อการสื่อสาร และการใช้เทคโนโลยี สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สารสนเทศเพื่อวางแผน แก้ปัญหา ในระหว่าง สื่อสาร และใช้เทคโนโลยีสารสนเทศในการวางแผนและ ปฏิบัติงาน และนําเสนอรายงานสหกิจศึกษา แก้ปัญหาในระหว่างปฏิบัติงานได้อย่างมีประสิทธิภาพ ที่เป็นประโยชน์ต่อสถานประกอบการได้ ผลงานหรือการนําเสนอรายงานสหกิจศึกษามีคุณภาพสูง ชัดเจน ตรงประเด็น และสามารถตอบสนองความต้องการ ของสถานประกอบการได้อย่างยอดเยี่ยม', 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', 'สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สื่อสาร และใช้เทคโนโลยีสารสนเทศในการวางแผนและ แก้ปัญหาในระหว่างปฏิบัติงานได้ดี ผลงานหรือการ นําเสนอรายงานสหกิจศึกษามีความสมบูรณ์ และ ตอบสนองต่อความต้องการของสถานประกอบการได้ดี', 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สื่อสาร และใช้เทคโนโลยีสารสนเทศในการวางแผนและ แก้ปัญหาในระหว่างปฏิบัติงานได้ แต่ยังต้องได้รับ คําแนะนําหรือการดูแลบางครั้งจากพี่เลี้ยงหรือผู้เกี่ยวข้อง', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', 'สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สื่อสาร และใช้เทคโนโลยีสารสนเทศในการวางแผนและ แก้ปัญหาในระหว่างปฏิบัติงานได้ในระดับพื้นฐาน แต่ต้องมี การดูแลอย่างใกล้ชิดจากพี่เลี้ยงหรือผู้นิเทศ', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ไม่สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สื่อสาร หรือการใช้เทคโนโลยีสารสนเทศในการวางแผน และแก้ปัญหาในระหว่างปฏิบัติงานได้ ผลงานหรือรายงาน ที่นําเสนอยังไม่ตอบโจทย์หรือไม่สามารถนําไปใช้ประโยชน์ ในสถานประกอบการได้ 4 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน', 1, 5);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะด้านการคิด การวิเคราะห์ การ', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', 'Excellent', 'สื่อสาร เพื่อแก้ปัญหาและปฏิบัติงานร่วมกับ แสดงให้เห็นถึงทักษะการคิดและการวิเคราะห์ที่ชัดเจนและ ผู้อื่นในสถานประกอบการได้ ลึกซึ้ง สามารถแก้ปัญหาที่ซับซ้อนได้อย่างสร้างสรรค์และมี ประสิทธิภาพ การสื่อสารมีความชัดเจนและมีผลลัพธ์ที่ดี เยี่ยมในสถานการณ์ต่าง ๆ สามารถทํางานร่วมกับผู้อื่นได้ อย่างราบรื่นและมีส่วนช่วยส่งเสริมความสําเร็จของทีม', 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', 'แสดงทักษะการคิดและการวิเคราะห์ที่ดี สามารถแก้ปัญหา ส่วนใหญ่ได้อย่างเหมาะสมและมีประสิทธิภาพ การสื่อสาร มีความชัดเจน เข้าใจง่าย และทํางานร่วมกับผู้อื่นในทีมได้ อย่างดี', 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'สามารถแสดงทักษะการคิดและการวิเคราะห์ในระดับที่ เพียงพอสําหรับแก้ปัญหางานทั่วไป การสื่อสารยังคงเข้าใจ ไดแ้ ละเหมาะสมในบริบทส่วนใหญ่ แต่บางครั้งอาจต้องการ คําแนะนําหรือการช่วยเหลือในการทํางานร่วมกับทีม', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', 'ทักษะการคิด การวิเคราะห์ และการแก้ปัญหายังอยู่ใน ระดับพื้นฐาน สามารถจัดการงานบางส่วนได้ แต่ต้องการ คําแนะนําอย่างใกล้ชิด การสื่อสารอาจไม่ชัดเจนในบางครั้ง และการทํางานร่วมกับผู้อื่นในทีมยังต้องปรับปรุง', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ไม่สามารถแสดงทักษะการคิด การวิเคราะห ์ หรือแก้ปัญหา ได้อย่างเหมาะสม การสื่อสารมีปัญหา ทําให้เกิดความ เข้าใจผิดบ่อยครั้ง และไม่สามารถทํางานร่วมกับผู้อื่นในทีม ได้อย่างมีประสิทธิภาพ', 1, 5);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการใช้เทคโนโลยีสารสนเทศเพื่อ', NULL, 'LO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', 'Excellent', 'การสืบค้น และสร้างสรรค์งานเพื่อตอบสนอง สามารถใช้เทคโนโลยีสารสนเทศได้อย่างเชี่ยวชาญและมี การปฏิบัติงานของสถานประกอบการ ประสิทธิภาพทั้งในการสืบค้นข้อมูลและการสร้างสรรค์งาน ผลงานมีความสร้างสรรค์ มีคุณภาพสูง และตอบสนองต่อ ความต้องการของสถานประกอบการได้อย่างสมบูรณ์แบบ 5 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน', 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', 'มีทักษะการใช้เทคโนโลยีสารสนเทศที่ดี สามารถสืบค้น ข้อมูลและสร้างสรรค์งานได้อย่างมีประสิทธิภาพ ผลงานมี ความสมบูรณ์และตรงกับความต้องการของสถาน ประกอบการ', 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'สามารถใช้เทคโนโลยีสารสนเทศได้ในระดับที่เพียงพอ สําหรับการสืบค้นข้อมูลและสร้างสรรค์งานทั่วไป ผลงาน อยู่ในระดับที่ยอมรับได้ แต่บางครั้งอาจต้องการคําแนะนํา หรือการดูแลจากพี่เลี้ยงหรือผู้เกี่ยวข้อง', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', 'การใช้เทคโนโลยีสารสนเทศอยู่ในระดับพื้นฐาน สามารถ สืบคน้ ข้อมูลและสร้างสรรค์งานได้บางส่วน แต่ต้องการ คําแนะนําหรือการดูแลอย่างใกล้ชิด', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ไม่สามารถใช้เทคโนโลยีสารสนเทศในการสืบค้นหรือ สร้างสรรค์งานได้อย่างเหมาะสม ผลงานที่นําเสนอไม่ สามารถตอบสนองความต้องการของสถานประกอบการได้', 1, 5);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการผลิตและการนําเสนอผลงาน', NULL, 'LO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', 'Excellent', 'โดยใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สามารถผลิตผลงานที่มีความสร้างสรรค์ เนื้อหามีความ สื่อสาร ถูกต้อง สมบูรณ์ และเหมาะสมกับวัตถุประสงค์การสื่อสาร ใช้ภาษาไทยได้อย่างถูกต้อง ชัดเจน และมีความน่าสนใจสูง การนําเสนอผลงานโดดเด่น ดึงดูดความสนใจของผู้ฟัง และ ตอบโจทย์ความต้องการของสถานประกอบการได้อย่าง', 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ยอดเยี่ยม', 'Excellent', NULL, 5, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', 'สามารถผลิตผลงานที่มีความสมบูรณ์ เนื้อหามีความถูกต้อง และเหมาะสมกับวัตถุประสงค์ ใช้ภาษาไทยได้ดีและมีความ ชัดเจน การนําเสนอผลงานมีความน่าสนใจและตอบโจทย์ ความต้องการของสถานประกอบการได้อย่างดี', 4, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', '6 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน สามารถผลิตผลงานที่อยู่ในระดับยอมรับได้ เนื้อหามีความ ถูกต้องในภาพรวมแต่ยังอาจขาดความลึกซึ้ง ใช้ภาษาไทย ได้ถูกต้องในระดับพื้นฐาน การนําเสนอผลงานมีความ ชัดเจนพอสมควร แต่ยังขาดความดึงดูดใจหรือความลื่นไหล ในการนําเสนอ', 3, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', 'การผลิตผลงานยังอยู่ในระดับพื้นฐาน เนื้อหามีความ ถูกต้องบางส่วน แต่ขาดความสมบูรณ์หรือไม่ชัดเจน เพียงพอ การใช้ภาษาไทยอาจมีข้อผิดพลาดบ้าง การ นําเสนอผลงานขาดความชัดเจนและยังต้องการการพัฒนา', 2, 5);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ไม่สามารถผลิตผลงานที่ตอบโจทย์หรือเหมาะสมกับ วัตถุประสงค์ได้ การใช้ภาษาไทยมีข้อผิดพลาดจํานวนมาก การนําเสนอผลงานขาดความชัดเจนและไม่สามารถดึงดูด ความสนใจของผู้ฟังได้ ตอนท ี่ 2 ผลลัพธ์การเรียนรู้', 1, 6);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงความซื่อสัตย์ ความกตัญญู ความ', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', 'Excellent', 'รับผิดชอบต่อตนเองและส่วนรวม ยึดมั่นตามหลัก แสดงออกถึงความซื่อสัตย์ ความกตัญญู และความ จรรยาบรรณวิชาชีพ และเคารพต่อกฎระเบียบของ รับผิดชอบอย่างโดดเด่นในทุกด้าน ทั้งต่อตนเองและ สถานประกอบการ ส่วนรวม ปฏิบัติตามหลักจรรยาบรรณวิชาชีพอย่าง เคร่งครัด มีวินัยและปฏิบัติตามกฎระเบียบของสถาน ประกอบการโดยไม่ต้องมีการเตือนหรือกํากับ', 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', 'มีความซื่อสัตย์ ความกตัญญ ู และความรับผิดชอบใน ระดับดี แสดงออกถึงการยึดมั่นในจรรยาบรรณ วิชาชีพและเคารพกฎระเบียบของสถาน ประกอบการอย่างเหมาะสม อาจมีข้อผิดพลาด เล็กน้อย แต่สามารถแก้ไขได้โดยไม่ต้องการ คําแนะนําเพิ่มเติม 7 ลักษณะบุคคล/สมรรถนะ ผลการประเมิน', 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'มีความซื่อสัตย์ ความกตัญญ ู และความรับผิดชอบใน ระดับที่ยอมรับได้ แสดงออกถึงความตั้งใจที่จะยึด มั่นในจรรยาบรรณวิชาชีพและปฏิบัติตาม กฎระเบียบ แต่บางครั้งอาจต้องการคําเตือนหรือ คําแนะนําเพื่อปรับปรุงพฤติกรรม', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', 'แสดงความซื่อสัตย์ ความกตัญญู และความ รับผิดชอบในระดับพื้นฐาน แต่ยังขาดความต่อเนื่อง และความมั่นคงในการปฏิบัติ บางครั้งไม่สามารถ ปฏิบัติตามจรรยาบรรณวิชาชีพหรือกฎระเบียบได้ อย่างเหมาะสม และต้องการการกํากับดูแลอย่าง ใกล้ชิด', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ขาดการแสดงออกถึงความซื่อสัตย์ ความกตัญญู และความรับผิดชอบอย่างชัดเจน ไม่ปฏิบัติตามหลัก จรรยาบรรณวิชาชีพหรือกฎระเบียบของสถาน ประกอบการ และมีพฤติกรรมที่ส่งผลเสียต่อ ส่วนรวม', 1, 5);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงการมีวินัย การมีภาวะผู้นํา', NULL, 'LO7', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', 'Excellent', 'สามารถเป็นได้ทั้งผู้นําและผู้ตาม ทํางานร่วมกับผู้อื่น แสดงออกถึงการมีวินัยและภาวะผู้นําอย่างเด่นชัด ได ้ สามารถทํางานร่วมกับผู้อื่นได้ดีทั้งในบทบาทของ ผู้นําและผู้ตาม การทํางานในทีมเป็นไปอย่างราบรื่น มีการสนับสนุนและกระตุ้นทีมให้สําเร็จตาม เป้าหมาย สามารถตัดสินใจได้ดีในสถานการณ์ต่าง ๆ และรับผิดชอบในการตัดสินใจของตนเอง', 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', 'Very Good', 'มีวินัยและภาวะผู้นําที่ดี สามารถทํางานร่วมกับผู้อื่น ได้ทั้งในบทบาทของผู้นําและผู้ตาม มีการสนับสนุน ทีมและทํางานร่วมกันได้อย่างดี การตัดสินใจใน สถานการณ์ต่าง ๆ สามารถทําได้ดี และยึดมั่นใน หน้าที่ความรับผิดชอบ 8 ลักษณะบุคคล/สมรรถนะ ผลการประเมิน', 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'มีวินัยและภาวะผู้นําในระดับที่ดี แต่ยังต้องการการ พัฒนาเพิ่มเติมในการทํางานร่วมกับผู้อื่นในบาง สถานการณ์ สามารถเป็นผู้นําและผู้ตามได้ตาม สถานการณ์ แต่บางครั้งอาจขาดการแสดงออกที่ ชัดเจนหรือการตัดสินใจที่แข็งแกร่ง', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', 'แสดงวินัยในระดับพื้นฐานและสามารถทํางาน ร่วมกับผู้อื่นได้ในบางสถานการณ์ การมีภาวะผู้นํายัง ไม่ชัดเจนและต้องการการสนับสนุนจากผู้อื่นในบาง กรณ ี การทํางานร่วมกับทีมอาจไม่ราบรื่นเท่าที่ควร', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', 'Needs Improvement', 'ไม่แสดงออกถึงการมีวินัยหรือภาวะผู้นําที่เหมาะสม การทํางานร่วมกับผู้อื่นมีปัญหา ไม่สามารถเป็นทั้ง ผู้นําและผู้ตามได้อย่างมีประสิทธิภาพ จําเป็นต้อง พัฒนาในการตัดสินใจและการทํางานเป็นทีม 9', 1, 5);
END $$;

