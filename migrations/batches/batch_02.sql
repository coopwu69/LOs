DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, '(Program Learning Outcome: PLO)', NULLIF('1', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'LOs-ของรายวิชาสหกิจศึกษา-67-ไทยเพื่อการสื่อสาร.pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้องค์ความรู้ด้าน', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', NULLIF('Excellent', ''), NULLIF('มนุษยศาสตร์ สังคมศาสตร์ โดยเฉพาะด้าน สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ ภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย การสร้างสรรค์เนื้อหา ด้านงานเขียน งาน เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ ประชาสัมพันธ์ หรืองานวิชาการเพื่อการ งานวิชาการที่ได้รับมอบหมายในสถานประกอบการได้ ปฏิบัติงานในสถานประกอบการ อย่างโดดเด่น ผลงานมีคุณภาพสูง ชัดเจน และสามารถ ตอบสนองความต้องการขององค์กรได้อย่างมีประสิทธิภาพ', ''), 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ งานวิชาการที่ได้รับมอบหมายในสถานประกอบการได้ดี ผลงานมีความสมบูรณ์ และสามารถใช้งานได้จริงในองค์กร', ''), 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ งานวิชาการที่ได้รับมอบหมายได้ แต่ยังต้องได้รับคําแนะนํา หรือการดูแลบางครั้งจากพี่เลี้ยงหรือผู้เกี่ยวข้อง', ''), 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ งานวิชาการที่ได้รับมอบหมายได้ในระดับพื้นฐาน แต่ต้องมี การดูแลอย่างใกล้ชิดจากพี่เลี้ยงหรือผู้นิเทศ', ''), 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ไม่สามารถประยุกต์ใช้องค์ความรู้ด้านมนุษยศาสตร์ สังคมศาสตร์ ด้านภาษา วรรณกรรม และวัฒนธรรมไทย เพื่อสร้างสรรค์เนื้อหาในงานเขียน งานประชาสัมพันธ์ หรือ งานวิชาการที่ได้รับมอบหมายได้ 3 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน', ''), 1, 5);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้องค์ความรู้ด้านภาษาไทย', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', NULLIF('Excellent', ''), NULLIF('เพื่อการสื่อสาร และการใช้เทคโนโลยี สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สารสนเทศเพื่อวางแผน แก้ปัญหา ในระหว่าง สื่อสาร และใช้เทคโนโลยีสารสนเทศในการวางแผนและ ปฏิบัติงาน และนําเสนอรายงานสหกิจศึกษา แก้ปัญหาในระหว่างปฏิบัติงานได้อย่างมีประสิทธิภาพ ที่เป็นประโยชน์ต่อสถานประกอบการได้ ผลงานหรือการนําเสนอรายงานสหกิจศึกษามีคุณภาพสูง ชัดเจน ตรงประเด็น และสามารถตอบสนองความต้องการ ของสถานประกอบการได้อย่างยอดเยี่ยม', ''), 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สื่อสาร และใช้เทคโนโลยีสารสนเทศในการวางแผนและ แก้ปัญหาในระหว่างปฏิบัติงานได้ดี ผลงานหรือการ นําเสนอรายงานสหกิจศึกษามีความสมบูรณ์ และ ตอบสนองต่อความต้องการของสถานประกอบการได้ดี', ''), 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สื่อสาร และใช้เทคโนโลยีสารสนเทศในการวางแผนและ แก้ปัญหาในระหว่างปฏิบัติงานได้ แต่ยังต้องได้รับ คําแนะนําหรือการดูแลบางครั้งจากพี่เลี้ยงหรือผู้เกี่ยวข้อง', ''), 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สื่อสาร และใช้เทคโนโลยีสารสนเทศในการวางแผนและ แก้ปัญหาในระหว่างปฏิบัติงานได้ในระดับพื้นฐาน แต่ต้องมี การดูแลอย่างใกล้ชิดจากพี่เลี้ยงหรือผู้นิเทศ', ''), 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ไม่สามารถประยุกต์ใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สื่อสาร หรือการใช้เทคโนโลยีสารสนเทศในการวางแผน และแก้ปัญหาในระหว่างปฏิบัติงานได้ ผลงานหรือรายงาน ที่นําเสนอยังไม่ตอบโจทย์หรือไม่สามารถนําไปใช้ประโยชน์ ในสถานประกอบการได้ 4 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน', ''), 1, 5);
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะด้านการคิด การวิเคราะห์ การ', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', NULLIF('Excellent', ''), NULLIF('สื่อสาร เพื่อแก้ปัญหาและปฏิบัติงานร่วมกับ แสดงให้เห็นถึงทักษะการคิดและการวิเคราะห์ที่ชัดเจนและ ผู้อื่นในสถานประกอบการได้ ลึกซึ้ง สามารถแก้ปัญหาที่ซับซ้อนได้อย่างสร้างสรรค์และมี ประสิทธิภาพ การสื่อสารมีความชัดเจนและมีผลลัพธ์ที่ดี เยี่ยมในสถานการณ์ต่าง ๆ สามารถทํางานร่วมกับผู้อื่นได้ อย่างราบรื่นและมีส่วนช่วยส่งเสริมความสําเร็จของทีม', ''), 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('แสดงทักษะการคิดและการวิเคราะห์ที่ดี สามารถแก้ปัญหา ส่วนใหญ่ได้อย่างเหมาะสมและมีประสิทธิภาพ การสื่อสาร มีความชัดเจน เข้าใจง่าย และทํางานร่วมกับผู้อื่นในทีมได้ อย่างดี', ''), 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('สามารถแสดงทักษะการคิดและการวิเคราะห์ในระดับที่ เพียงพอสําหรับแก้ปัญหางานทั่วไป การสื่อสารยังคงเข้าใจ ไดแ้ ละเหมาะสมในบริบทส่วนใหญ่ แต่บางครั้งอาจต้องการ คําแนะนําหรือการช่วยเหลือในการทํางานร่วมกับทีม', ''), 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('ทักษะการคิด การวิเคราะห์ และการแก้ปัญหายังอยู่ใน ระดับพื้นฐาน สามารถจัดการงานบางส่วนได้ แต่ต้องการ คําแนะนําอย่างใกล้ชิด การสื่อสารอาจไม่ชัดเจนในบางครั้ง และการทํางานร่วมกับผู้อื่นในทีมยังต้องปรับปรุง', ''), 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ไม่สามารถแสดงทักษะการคิด การวิเคราะห ์ หรือแก้ปัญหา ได้อย่างเหมาะสม การสื่อสารมีปัญหา ทําให้เกิดความ เข้าใจผิดบ่อยครั้ง และไม่สามารถทํางานร่วมกับผู้อื่นในทีม ได้อย่างมีประสิทธิภาพ', ''), 1, 5);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการใช้เทคโนโลยีสารสนเทศเพื่อ', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', NULLIF('Excellent', ''), NULLIF('การสืบค้น และสร้างสรรค์งานเพื่อตอบสนอง สามารถใช้เทคโนโลยีสารสนเทศได้อย่างเชี่ยวชาญและมี การปฏิบัติงานของสถานประกอบการ ประสิทธิภาพทั้งในการสืบค้นข้อมูลและการสร้างสรรค์งาน ผลงานมีความสร้างสรรค์ มีคุณภาพสูง และตอบสนองต่อ ความต้องการของสถานประกอบการได้อย่างสมบูรณ์แบบ 5 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน', ''), 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('มีทักษะการใช้เทคโนโลยีสารสนเทศที่ดี สามารถสืบค้น ข้อมูลและสร้างสรรค์งานได้อย่างมีประสิทธิภาพ ผลงานมี ความสมบูรณ์และตรงกับความต้องการของสถาน ประกอบการ', ''), 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('สามารถใช้เทคโนโลยีสารสนเทศได้ในระดับที่เพียงพอ สําหรับการสืบค้นข้อมูลและสร้างสรรค์งานทั่วไป ผลงาน อยู่ในระดับที่ยอมรับได้ แต่บางครั้งอาจต้องการคําแนะนํา หรือการดูแลจากพี่เลี้ยงหรือผู้เกี่ยวข้อง', ''), 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('การใช้เทคโนโลยีสารสนเทศอยู่ในระดับพื้นฐาน สามารถ สืบคน้ ข้อมูลและสร้างสรรค์งานได้บางส่วน แต่ต้องการ คําแนะนําหรือการดูแลอย่างใกล้ชิด', ''), 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ไม่สามารถใช้เทคโนโลยีสารสนเทศในการสืบค้นหรือ สร้างสรรค์งานได้อย่างเหมาะสม ผลงานที่นําเสนอไม่ สามารถตอบสนองความต้องการของสถานประกอบการได้', ''), 1, 5);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการผลิตและการนําเสนอผลงาน', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', NULLIF('Excellent', ''), NULLIF('โดยใช้องค์ความรู้ด้านภาษาไทยเพื่อการ สามารถผลิตผลงานที่มีความสร้างสรรค์ เนื้อหามีความ สื่อสาร ถูกต้อง สมบูรณ์ และเหมาะสมกับวัตถุประสงค์การสื่อสาร ใช้ภาษาไทยได้อย่างถูกต้อง ชัดเจน และมีความน่าสนใจสูง การนําเสนอผลงานโดดเด่น ดึงดูดความสนใจของผู้ฟัง และ ตอบโจทย์ความต้องการของสถานประกอบการได้อย่าง', ''), 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ยอดเยี่ยม', NULLIF('Excellent', ''), NULLIF('', ''), 5, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('สามารถผลิตผลงานที่มีความสมบูรณ์ เนื้อหามีความถูกต้อง และเหมาะสมกับวัตถุประสงค์ ใช้ภาษาไทยได้ดีและมีความ ชัดเจน การนําเสนอผลงานมีความน่าสนใจและตอบโจทย์ ความต้องการของสถานประกอบการได้อย่างดี', ''), 4, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('6 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน สามารถผลิตผลงานที่อยู่ในระดับยอมรับได้ เนื้อหามีความ ถูกต้องในภาพรวมแต่ยังอาจขาดความลึกซึ้ง ใช้ภาษาไทย ได้ถูกต้องในระดับพื้นฐาน การนําเสนอผลงานมีความ ชัดเจนพอสมควร แต่ยังขาดความดึงดูดใจหรือความลื่นไหล ในการนําเสนอ', ''), 3, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('การผลิตผลงานยังอยู่ในระดับพื้นฐาน เนื้อหามีความ ถูกต้องบางส่วน แต่ขาดความสมบูรณ์หรือไม่ชัดเจน เพียงพอ การใช้ภาษาไทยอาจมีข้อผิดพลาดบ้าง การ นําเสนอผลงานขาดความชัดเจนและยังต้องการการพัฒนา', ''), 2, 5);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ไม่สามารถผลิตผลงานที่ตอบโจทย์หรือเหมาะสมกับ วัตถุประสงค์ได้ การใช้ภาษาไทยมีข้อผิดพลาดจํานวนมาก การนําเสนอผลงานขาดความชัดเจนและไม่สามารถดึงดูด ความสนใจของผู้ฟังได้ ตอนท ี่ 2 ผลลัพธ์การเรียนรู้', ''), 1, 6);
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงความซื่อสัตย์ ความกตัญญู ความ', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', NULLIF('Excellent', ''), NULLIF('รับผิดชอบต่อตนเองและส่วนรวม ยึดมั่นตามหลัก แสดงออกถึงความซื่อสัตย์ ความกตัญญู และความ จรรยาบรรณวิชาชีพ และเคารพต่อกฎระเบียบของ รับผิดชอบอย่างโดดเด่นในทุกด้าน ทั้งต่อตนเองและ สถานประกอบการ ส่วนรวม ปฏิบัติตามหลักจรรยาบรรณวิชาชีพอย่าง เคร่งครัด มีวินัยและปฏิบัติตามกฎระเบียบของสถาน ประกอบการโดยไม่ต้องมีการเตือนหรือกํากับ', ''), 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('มีความซื่อสัตย์ ความกตัญญ ู และความรับผิดชอบใน ระดับดี แสดงออกถึงการยึดมั่นในจรรยาบรรณ วิชาชีพและเคารพกฎระเบียบของสถาน ประกอบการอย่างเหมาะสม อาจมีข้อผิดพลาด เล็กน้อย แต่สามารถแก้ไขได้โดยไม่ต้องการ คําแนะนําเพิ่มเติม 7 ลักษณะบุคคล/สมรรถนะ ผลการประเมิน', ''), 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('มีความซื่อสัตย์ ความกตัญญ ู และความรับผิดชอบใน ระดับที่ยอมรับได้ แสดงออกถึงความตั้งใจที่จะยึด มั่นในจรรยาบรรณวิชาชีพและปฏิบัติตาม กฎระเบียบ แต่บางครั้งอาจต้องการคําเตือนหรือ คําแนะนําเพื่อปรับปรุงพฤติกรรม', ''), 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('แสดงความซื่อสัตย์ ความกตัญญู และความ รับผิดชอบในระดับพื้นฐาน แต่ยังขาดความต่อเนื่อง และความมั่นคงในการปฏิบัติ บางครั้งไม่สามารถ ปฏิบัติตามจรรยาบรรณวิชาชีพหรือกฎระเบียบได้ อย่างเหมาะสม และต้องการการกํากับดูแลอย่าง ใกล้ชิด', ''), 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ขาดการแสดงออกถึงความซื่อสัตย์ ความกตัญญู และความรับผิดชอบอย่างชัดเจน ไม่ปฏิบัติตามหลัก จรรยาบรรณวิชาชีพหรือกฎระเบียบของสถาน ประกอบการ และมีพฤติกรรมที่ส่งผลเสียต่อ ส่วนรวม', ''), 1, 5);
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงการมีวินัย การมีภาวะผู้นํา', NULLIF('', ''), NULLIF('LO7', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีเยี่ยม', NULLIF('Excellent', ''), NULLIF('สามารถเป็นได้ทั้งผู้นําและผู้ตาม ทํางานร่วมกับผู้อื่น แสดงออกถึงการมีวินัยและภาวะผู้นําอย่างเด่นชัด ได ้ สามารถทํางานร่วมกับผู้อื่นได้ดีทั้งในบทบาทของ ผู้นําและผู้ตาม การทํางานในทีมเป็นไปอย่างราบรื่น มีการสนับสนุนและกระตุ้นทีมให้สําเร็จตาม เป้าหมาย สามารถตัดสินใจได้ดีในสถานการณ์ต่าง ๆ และรับผิดชอบในการตัดสินใจของตนเอง', ''), 5, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('มีวินัยและภาวะผู้นําที่ดี สามารถทํางานร่วมกับผู้อื่น ได้ทั้งในบทบาทของผู้นําและผู้ตาม มีการสนับสนุน ทีมและทํางานร่วมกันได้อย่างดี การตัดสินใจใน สถานการณ์ต่าง ๆ สามารถทําได้ดี และยึดมั่นใน หน้าที่ความรับผิดชอบ 8 ลักษณะบุคคล/สมรรถนะ ผลการประเมิน', ''), 4, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('มีวินัยและภาวะผู้นําในระดับที่ดี แต่ยังต้องการการ พัฒนาเพิ่มเติมในการทํางานร่วมกับผู้อื่นในบาง สถานการณ์ สามารถเป็นผู้นําและผู้ตามได้ตาม สถานการณ์ แต่บางครั้งอาจขาดการแสดงออกที่ ชัดเจนหรือการตัดสินใจที่แข็งแกร่ง', ''), 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('แสดงวินัยในระดับพื้นฐานและสามารถทํางาน ร่วมกับผู้อื่นได้ในบางสถานการณ์ การมีภาวะผู้นํายัง ไม่ชัดเจนและต้องการการสนับสนุนจากผู้อื่นในบาง กรณ ี การทํางานร่วมกับทีมอาจไม่ราบรื่นเท่าที่ควร', ''), 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ไม่แสดงออกถึงการมีวินัยหรือภาวะผู้นําที่เหมาะสม การทํางานร่วมกับผู้อื่นมีปัญหา ไม่สามารถเป็นทั้ง ผู้นําและผู้ตามได้อย่างมีประสิทธิภาพ จําเป็นต้อง พัฒนาในการตัดสินใจและการทํางานเป็นทีม 9', ''), 1, 5);
END $$;

