DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรบริหารธุรกิจบัณฑิต', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'แบบประเมินสหกิจฯ สาขาการจัดการการท่องเที่ยวและการโรงแรม (updated 30 Jan 2025).pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ประยุกต์ความรู้ด้านบริหารธุรกิจและการจัดการ 5 (ยอดเยี่ยม): นักศึกษาสามารถวิเคราะห์สถานการณ์ นวัตกรรมเพื่อการด าเนินงานด้านการท่องเที่ยวและ และเสนอแนวทางแก้ไขปัญหาโดยใช้หลักการบริหารธุรกิจ การโรงแรม ได้อย่างเป็นระบบ น าเสนอนวัตกรรมหรือแนวคิดใหม่ๆ ที่ สามารถน าไปใช้ได้จริงในองค์กร มีการบูรณาการความรู้ จากหลายศาสตร์มาประยุกต์ใช้ได้อย่างเหมาะสม', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาสามารถประยุกต์ใช้หลักการ บริหารธุรกิจในการท างานได้ดี มีการน าเสนอแนวคิดใหม่ๆ ในการพัฒนางาน เข้าใจและเชื่อมโยงทฤษฎีสู่การปฏิบัติได้', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาเข้าใจหลักการบริหารธุรกิจพื้นฐาน และน ามาใช้ในงานได้ ท างานตามกระบวนการมาตรฐาน ขององค์กรได้ดี รู้จักปรับปรุงวิธีการท างานเมื่อได้รับ ค าแนะน า', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาเข้าใจหลักการพื้นฐานแต่ ประยุกต์ใช้ได้จ ากัด ต้องได้รับค าแนะน าในการท างาน บ่อยครั้ง ท างานตามที่ได้รับมอบหมายได้แต่ขาดการริเริ่ม', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาไม่สามารถน าความรู้มา ประยุกต์ใช้ในงานได้ ไม่เข้าใจหลักการพื้นฐานที่จ าเป็น ต้อง ได้รับการก ากับดูแลอย่างใกล้ชิดตลอดเวลา (5) LO2: ประยุกต์ความรู้การจัดการการท่องเที่ยวและ 5 (ยอดเยี่ยม): นักศึกษาสามารถจัดการงานบริการได้ การโรงแรมเพื่อการปฏิบัติงานด้านการท่องเที่ยวและ อย่างมีประสิทธิภาพสูง โดยได้รับความพึงพอใจจากลูกค้า การโรงแรม > 90% แก้ไขสถานการณ์เฉพาะหน้าได้อย่างเหมาะสมและ รวดเร็ว สามารถสอนงานหรือแนะน าเพื่อนร่วมงานได้', 1, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาสามารถจัดการงานบริการได้ดี ได้รับความพึงพอใจจากลูกค้า 80-90% แก้ไขปัญหาพื้นฐาน ในงานบริการได้ด้วยตนเอง มีการวางแผนและจัดล าดับ ความส าคัญของงานได้ดี', 4, 5);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาสามารถให้บริการตามมาตรฐานได้ดี ได้รับความพึงพอใจจากลูกค้า 70-79% ท างานตามขั้นตอน ที่ก าหนดได้ครบถ้วน สื่อสารกับลูกค้าและเพื่อนร่วมงานได้ อย่างเหมาะสม', 3, 6);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาสามารถให้บริการได้ตาม มาตรฐานขั้นต่ า ได้รับความพึงพอใจจากลูกค้า 60-69% ต้องได้รับค าแนะน าในการแก้ไขปัญหาเสมอ การสื่อสารกับ ลูกค้ายังมีข้อบกพร่อง', 2, 7);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'ไม่สามารถให้บริการตามมาตรฐาน ขั้นต่ า ได้รับความพึงพอใจจากลูกค้า < 60% ไม่สามารถ แก้ไขปัญหาพื้นฐานได้ มีปัญหาในการสื่อสารกับลูกค้าและ เพื่อนร่วมงาน (6) (2)', 1, 8);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการสื่อสารภาษาไทย และภาษาอังกฤษ 5 (ยอดเยี่ยม): นักศึกษาสามารถสื่อสารภาษาไทยและ เพื่อใช้ในชีวิตประจ าวันและในการท างานด้านการ ภาษาอังกฤษได้อย่างคล่องแคล่วทั้งการฟัง พูด อ่าน เขียน ท่องเที่ยวและการโรงแรมทั้งการฟัง พูด อ่าน เขียน สามารถน าเสนองานเป็นภาษาอังกฤษได้อย่างมี และน าเสนอผลงานได้อย่างเหมาะสมกับ สถานการณ์ ประสิทธิภาพ กรณีเลือกภาษาจีน: สื่อสารในชีวิตประจ าวัน ในกรณีนักศึกษาเลือกภาษาจีน สามารถสื่อสาร และงานบริการได้อย่างคล่องแคล่ว ภาษาจีน ในชีวิตประจ าวันได้', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาสามารถสื่อสารภาษาไทยได้ดีมาก และภาษาอังกฤษได้ดี น าเสนองานเป็นภาษาอังกฤษได้ โดย มีข้อผิดพลาดเล็กน้อย กรณีเลือกภาษาจีน: สื่อสารใน ชีวิตประจ าวันได้ดี มีข้อผิดพลาดน้อย', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาสามารถสื่อสารภาษาไทยได้ดี และ ภาษาอังกฤษได้ในระดับใช้งาน น าเสนองานเป็น ภาษาอังกฤษได้ แต่ต้องเตรียมตัวมาก กรณีเลือกภาษาจีน: สื่อสารประโยคพื้นฐานในชีวิตประจ าวันได้', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาสามารถสื่อสารภาษาไทยได้พอใช้ ภาษาอังกฤษมีข้อจ ากัด ต้องได้รับความช่วยเหลือในการ น าเสนองานภาษาอังกฤษ กรณีเลือกภาษาจีน: สื่อสารได้ เฉพาะประโยคง่ายๆ', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษามีปัญหาในการสื่อสารทั้ง ภาษาไทยและภาษาอังกฤษ ไม่สามารถน าเสนองานเป็น ภาษาอังกฤษได้ กรณีเลือกภาษาจีน: ไม่สามารถสื่อสาร ภาษาจีนได้แม้แต่ประโยคพื้นฐาน', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการใช้เทคโนโลยีสารสนเทศเพื่อสืบค้น 5 (ยอดเยี่ยม): นักศึกษาสามารถใช้โปรแกรม ข้อมูล วิเคราะห์ น าเสนอ และมีทักษะการใช้โปรแกรม ส านักงานและระบบสารสนเทศขององค์กรได้อย่าง ประยุกต์ในงานด้านการท่องเที่ยวและการโรงแรม คล่องแคล่ว สามารถแก้ไขปัญหาทางเทคนิคเบื้องต้นได้ด้วย ตนเอง สามารถประยุกต์ใช้เทคโนโลยีใหม่ๆ เพื่อพัฒนางาน ได้', NULL, 'LO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาสามารถใช้โปรแกรมส านักงานได้', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'และเรียนรู้ระบบใหม่ได้เร็ว ต้องการความช่วยเหลือใน การแก้ปัญหาทางเทคนิคเพียงเล็กน้อย มีความคิดริเริ่มใน การใช้เทคโนโลยีเพื่อพัฒนางาน', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาสามารถใช้โปรแกรมพื้นฐานได้ดี เรียนรู้ระบบใหม่ได้เมื่อได้รับการสอน ท างานกับระบบ สารสนเทศขององค์กรได้ตามมาตรฐาน', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาสามารถใช้โปรแกรมพื้นฐานได้แต่ มีข้อจ ากัด ต้องการความช่วยเหลือในการใช้ระบบใหม่ บ่อยครั้ง ท างานกับระบบสารสนเทศได้ช้า', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาไม่สามารถใช้โปรแกรม พื้นฐานได้อย่างมีประสิทธิภาพ ไม่สามารถเรียนรู้ระบบใหม่ ได้แม้จะได้รับการสอน มีปัญหาในการใช้ระบบสารสนเทศ ขององค์กร', 1, 5);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการแก้ไขปัญหาในการปฏิบัติงานด้าน 5 (ยอดเยี่ยม): นักศึกษาสามารถวิเคราะห์สาเหตุของ การท่องเที่ยวและการโรงแรม โดยการคิดวิเคราะห์ ปัญหาได้อย่างเป็นระบบ เสนอทางเลือกในการแก้ปัญหาได้ อย่างมีเหตุผล หลากหลายและสร้างสรรค์ แก้ไขปัญหาเฉพาะหน้าได้อย่าง มีประสิทธิภาพ โดยค านึงถึงผลกระทบระยะยาว', NULL, 'LO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาสามารถวิเคราะห์ปัญหาได้ดี เสนอแนวทางแก้ไขปัญหาได้มากกว่า 1 แนวทาง แก้ไข ปัญหาเฉพาะหน้าได้ดี', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาสามารถระบุปัญหาและสาเหตุได้ เสนอแนวทางแก้ไขปัญหาได้ 1 แนวทาง แก้ไขปัญหา พื้นฐานได้ตามแนวทางที่ก าหนด', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาสามารถระบุปัญหาได้แต่วิเคราะห์ สาเหตุได้ไม่ชัดเจน ต้องได้รับค าแนะน าในการแก้ไขปัญหา แก้ไขปัญหาได้เฉพาะเมื่อมีผู้ชี้แนะ', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาไม่สามารถระบุปัญหาและ สาเหตุได้ ไม่สามารถเสนอแนวทางแก้ไขปัญหา ไม่สามารถ แก้ไขปัญหาได้แม้จะได้รับค าแนะน า', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการให้บริการและนันทนาการด้านการ 5 (ยอดเยี่ยม): นักศึกษาสามารถให้บริการและหรือจัด ท่องเที่ยวและการโรงแรมแก่ลูกค้า กิจกรรมนันทนาการที่สร้างสรรค์และเหมาะสมกับกลุ่ม ลูกค้าได้โดดเด่น แก้ไขสถานการณ์เฉพาะหน้าในการ ให้บริการได้อย่างยอดเยี่ยม ได้รับความพึงพอใจจากลูกค้า ในระดับดีเยี่ยม (>90%)', NULL, 'LO6', 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาสามารถให้บริการและหรือจัด กิจกรรมนันทนาการที่น่าสนใจและเหมาะสมกับกลุ่มลูกค้า จัดการสถานการณ์ในการให้บริการได้ดี ได้รับความพึงพอใจ จากลูกค้าในระดับดีมาก (80-90%)', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาสามารถให้บริการและหรือจัดกิจกรรม นันทนาการตามแผนที่ก าหนดได้ ให้บริการได้ตามมาตรฐาน ได้รับความพึงพอใจจากลูกค้าในระดับดี (70-79%)', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาสามารถให้บริการและหรือจัด กิจกรรมนันทนาการได้แต่ต้องมีผู้ช่วยแนะน า ให้บริการได้ แต่ยังมีข้อบกพร่อง ได้รับความพึงพอใจจากลูกค้าในระดับ', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', 'Fair', '(60-69%)', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาไม่สามารถจัดกิจกรรม นันทนาการได้แม้จะมีผู้แนะน า มีปัญหาในการให้บริการ บ่อยครั้ง ได้รับความพึงพอใจจากลูกค้าในระดับต่ า (<60%)', 1, 5);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการออกแบบประสบการณ์การ 5 (ยอดเยี่ยม): นักศึกษาสามารถออกแบบโปรแกรม ท่องเที่ยวแก่ลูกค้าในแหล่งท่องเที่ยวและโรงแรม การท่องเที่ยวที่สร้างสรรค์และตอบโจทย์ความต้องการของ ลูกค้าได้ดีเยี่ยม บูรณาการทรัพยากรการท่องเที่ยวและ บริการต่างๆ ได้อย่างลงตัว น าเสนอประสบการณ์ที่แปลก ใหม่และน่าประทับใจ พร้อมค านึงถึงความยั่งยืน', NULL, 'LO7', 'single_choice'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาสามารถออกแบบโปรแกรมการ ท่องเที่ยวที่น่าสนใจและตอบสนองความต้องการของลูกค้า จัดการทรัพยากรการท่องเที่ยวและบริการได้อย่างมี ประสิทธิภาพ สร้างประสบการณ์ที่น่าจดจ าให้กับลูกค้าได้', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาสามารถออกแบบโปรแกรมการ ท่องเที่ยวตามมาตรฐานได้ จัดการทรัพยากรการท่องเที่ยว และบริการได้ตามแผน น าเสนอประสบการณ์ที่เหมาะสม กับกลุ่มลูกค้า', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาสามารถออกแบบโปรแกรมการ ท่องเที่ยวได้แต่ต้องมีผู้แนะน า จัดการทรัพยากรการ ท่องเที่ยวและบริการได้แต่มีข้อบกพร่อง น าเสนอ ประสบการณ์แบบพื้นฐานได้', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาไม่สามารถออกแบบ โปรแกรมการท่องเที่ยวได้แม้มีผู้แนะน า มีปัญหาในการ จัดการทรัพยากรการท่องเที่ยวและบริการ ไม่สามารถ น าเสนอประสบการณ์ที่น่าพอใจให้กับลูกค้า (3)', 1, 4);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีความรับผิดชอบต่อตนเอง สังคม และ 5 (ยอดเยี่ยม): นักศึกษามีความตรงต่อเวลาและ สิ่งแวดล้อม รับผิดชอบงานอย่างสม่ าเสมอ มีส่วนร่วมในกิจกรรมเพื่อ สังคมขององค์กรอย่างกระตือรือร้น ริเริ่มและน าเสนอแนว ทางการอนุรักษ์สิ่งแวดล้อมในการท างาน', NULL, 'LO8', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษามีความตรงต่อเวลาและรับผิดชอบ งานเป็นอย่างดี เข้าร่วมกิจกรรมเพื่อสังคมขององค์กรอย่าง สม่ าเสมอ ปฏิบัติตามแนวทางการอนุรักษ์สิ่งแวดล้อมของ องค์กรอย่างเคร่งครัด', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษามีความตรงต่อเวลาและรับผิดชอบงาน ตามที่ได้รับมอบหมาย เข้าร่วมกิจกรรมเพื่อสังคมตามที่ องค์กรก าหนด ปฏิบัติตามแนวทางการอนุรักษ์สิ่งแวดล้อม ขององค์กร', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช', NULL, '้ : นักศึกษามาสายหรือส่งงานล่าช้าบ้างเป็น ครั้งคราว เข้าร่วมกิจกรรมเพื่อสังคมเมื่อถูกร้องขอ ปฏิบัติ ตามแนวทางการอนุรักษ์สิ่งแวดล้อมไม่สม่ าเสมอ', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษามาสายหรือส่งงานล่าช้า บ่อยครั้ง ไม่เข้าร่วมกิจกรรมเพื่อสังคม ละเลยการปฏิบัติ ตามแนวทางการอนุรักษ์สิ่งแวดล้อม', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีความกตัญญู ซื่อสัตย์ และปฏิบัติตาม 5 (ยอดเยี่ยม): นักศึกษาปฏิบัติตามกฎระเบียบของ กฎระเบียบด้านการท่องเที่ยวและการโรงแรม และ องค์กรอย่างเคร่งครัดและสม่ าเสมอ รายงานข้อมูลและ สังคม น าส่งทรัพย์สิน/เงินอย่างถูกต้องครบถ้วนทุกครั้ง แสดง ความเคารพและให้เกียรติผู้อื่นอย่างสม่ าเสมอ เป็น แบบอย่างที่ดีให้เพื่อนร่วมงาน', NULL, 'LO9', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาปฏิบัติตามกฎระเบียบขององค์กร อย่างสม่ าเสมอ รายงานข้อมูลและน าส่งทรัพย์สิน/เงินอย่าง ถูกต้อง แสดงความเคารพและให้เกียรติผู้อื่นเป็นประจ า ได้รับความไว้วางใจจากผู้ร่วมงาน', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาปฏิบัติตามกฎระเบียบขององค์กรเป็น ส่วนใหญ่ รายงานข้อมูลและน าส่งทรัพย์สิน/เงินโดยมี ข้อผิดพลาดเล็กน้อย แสดงความเคารพและให้เกียรติผู้อื่น ไม่มีข้อร้องเรียนด้านความซื่อสัตย์', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษามีการละเลยการปฏิบัติตาม กฎระเบียบบ้าง มีข้อผิดพลาดในการรายงานข้อมูลและ น าส่งทรัพย์สิน/เงิน ขาดความเคารพหรือให้เกียรติผู้อื่น บางครั้ง ต้องได้รับการตักเตือนด้านความประพฤติ', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาละเลยการปฏิบัติตาม กฎระเบียบบ่อยครั้ง มีปัญหาด้านความซื่อสัตย์ในการ รายงานหรือน าส่งทรัพย์สิน ขาดความเคารพหรือให้เกียรติ ผู้อื่นบ่อยครั้ง มีข้อร้องเรียนด้านความประพฤติ', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการอนุรักษ์ทรัพยากรธรรมชาติ 5 (ยอดเยี่ยม): นักศึกษาริเริ่มหรือมีส่วนร่วมใน และวัฒนธรรมเพื่อลดผลกระทบที่เกิดขึ้นต่อ เศรษฐกิจ โครงการอนุรักษ์สิ่งแวดล้อมและวัฒนธรรมท้องถิ่น น าเสนอ สังคม และสิ่งแวดล้อม แนวทางลดผลกระทบต่อสิ่งแวดล้อมที่สามารถน าไปปฏิบัติ ได้จริง สื่อสารและสร้างความตระหนักด้านการอนุรักษ์แก่ ลูกค้าและผู้ร่วมงาน ปฏิบัติตามหลักการท่องเที่ยวอย่าง ยั่งยืนอย่างสม่ าเสมอ', NULL, 'LO10', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาเข้าร่วมกิจกรรมอนุรักษ์ สิ่งแวดล้อมและวัฒนธรรมท้องถิ่นอย่างสม่ าเสมอ ปฏิบัติ ตามแนวทางลดผลกระทบต่อสิ่งแวดล้อมอย่างเคร่งครัด ให้ ข้อมูลด้านการอนุรักษ์แก่ลูกค้าได้อย่างถูกต้อง ค านึงถึง ผลกระทบต่อสิ่งแวดล้อมในการท างาน', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาเข้าร่วมกิจกรรมอนุรักษ์ตามที่องค์กร ก าหนด ปฏิบัติตามแนวทางลดผลกระทบต่อสิ่งแวดล้อมได้', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'เข้าใจและสามารถอธิบายความส าคัญของการอนุรักษ์ ไม่ สร้างผลกระทบเชิงลบต่อสิ่งแวดล้อมและวัฒนธรรม', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาเข้าร่วมกิจกรรมอนุรักษ์เมื่อถูก ร้องขอ ปฏิบัติตามแนวทางลดผลกระทบต่อสิ่งแวดล้อมไม่ สม่ าเสมอ มีความเข้าใจด้านการอนุรักษ์ในระดับพื้นฐาน ขาดความใส่ใจต่อผลกระทบด้านสิ่งแวดล้อมบางครั้ง', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาไม่สนใจเข้าร่วมกิจกรรม อนุรักษ ์ ละเลยการปฏิบัติตามแนวทางลดผลกระทบต่อ สิ่งแวดล้อม ขาดความเข้าใจด้านการอนุรักษ์ สร้าง ผลกระทบเชิงลบต่อสิ่งแวดล้อมและวัฒนธรรม (4)', 1, 5);
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการมีจิตบริการ และบุคลิกภาพ 5 (ยอดเยี่ยม): นักศึกษาแต่งกายสุภาพเรียบร้อย ถูก ระเบียบทุกครั้ง ให้บริการด้วยความกระตือรือร้น เต็มใจ ท่องเที่ยวและการโรงแรมที่เหมาะสม และเป็นมิตร ได้รับค าชมเชยจากลูกค้าหรือผู้ร่วมงานเป็น ประจ า', NULL, 'LO11', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาแต่งกายสุภาพเรียบร้อยเกือบทุก ครั้ง ให้บริการด้วยความเต็มใจและเป็นมิตร ได้รับค าชมเชย จากลูกค้าหรือผู้ร่วมงานบ่อยครั้ง', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาแต่งกายถูกระเบียบเป็นส่วนใหญ่ ให้บริการตามมาตรฐานที่ก าหนด ไม่มีข้อร้องเรียนจาก ลูกค้าหรือผู้ร่วมงาน', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาแต่งกายไม่เรียบร้อยบ้างเป็นครั้ง คราว ให้บริการไม่สม่ าเสมอ มีข้อร้องเรียนจากลูกค้าหรือ ผู้ร่วมงานบ้าง', 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาแต่งกายไม่เหมาะสม บ่อยครั้ง ให้บริการไม่เต็มใจ หรือแสดงกิริยาไม่เหมาะสม มี ข้อร้องเรียนจากลูกค้าหรือผู้ร่วมงานบ่อยครั้ง', 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการมีวินัย มีภาวะผู้น า สามารถ 5 (ยอดเยี่ยม): นักศึกษาแสดงภาวะผู้น าในการท างาน เป็นได้ทั้งผู้น า และผู้ตาม ท างานร่วมกับผู้อื่นได้ มีจิต กลุ่ม รับฟังความคิดเห็นของผู้อื่นและประสานงานได้ดีเยี่ยม อาสา และสามารถพัฒนาตนเองในงานด้านการ มีจิตอาสาช่วยเหลืองานส่วนรวมสม่ าเสมอ ท่องเที่ยวและการโรงแรมได้อย่างต่อเนื่อง', NULL, 'LO12', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULL, 'นักศึกษาสามารถเป็นได้ทั้งผู้น าและผู้ตามที่', 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', 'Good', 'ประสานงานกับผู้อื่นได้ดี มีจิตอาสาช่วยเหลืองาน ส่วนรวมบ่อยครั้ง', 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULL, 'นักศึกษาท าหน้าที่ผู้น าหรือผู้ตามได้ตามที่ได้รับ มอบหมาย ท างานร่วมกับผู้อื่นได้ดี มีจิตอาสาช่วยเหลืองาน ส่วนรวมเมื่อมีโอกาส', 3, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULL, 'นักศึกษาไม่ค่อยแสดงบทบาทผู้น า ท างาน ร่วมกับผู้อื่นได้แต่มีข้อจ ากัด ช่วยเหลืองานส่วนรวมเมื่อถูก ร้องขอ', 2, 4);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ต้องปรับปรุง', NULL, 'นักศึกษาไม่สามารถเป็นผู้น าหรือผู้ ตามที่ดีได้ มีปัญหาในการท างานร่วมกับผู้อื่น ไม่มีจิตอาสา ช่วยเหลืองานส่วนรวม', 1, 5);
END $$;
