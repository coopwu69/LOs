DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'รายวิชา CPE67-493 สหกิจศึกษา', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา-วิศวกรรมเคมีฯ.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์ใข้ความรู้ทาง วิทยาศาสตร์ คณิตศาสตร์และสถิติได้อย่างเหมาะสม', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเลือกใช้เครื่องมือและเทคโนโลยีสารสนเทศที่เหมาะสมในการสืบค้นข้อมูลและความรู้ใหม่ สามารถรวบรวม วิเคราะห์ และสังเคราะห์ข้อมูล เพื่อหาข้อสรุปในการปฏิบัติงานในสถานประกอบการได้', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ผู้เรียนอ่านและเขียนแบบทางวิศวกรรม เข้าใจหลักการทำงานของอุปกรณ์และกระบวนการการผลิตที่เกี่ยวข้องกับงานที่ได้รับมอบหมายจากสถานประกอบสหกิจศึกษาได้', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเพื่อวิเคราะห์และแก้ปัญหาทางวิศวกรรมเคมีและเคมีเภสัชกรรมโดยคำนึงถึงความปลอดภัย เศรษฐศาสตร์ การบริหารงานวิศวกรรม และผลกระทบทางสิ่งแวดล้อมและพลังงาน ในการปฏิบัติงานสหกิจศึกษาได้อย่างเหมาะสม', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบและคำนึงถึงจริยธรรมและหลักวิชาชีพ', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถติดต่อสื่อสารทั้งภาษาไทยและภาษาอังกฤษ และทำงานร่วมกับผู้อื่นได้ในการปฏิบัติงานสหกิจศึกษาได้อย่างมีประสิทธิภาพ', NULLIF('', ''), NULLIF('LO7', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถแสวงหาความรู้ใหม่ที่ได้จากการปฏิบัติงานสหกิจศึกษาได้ ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULLIF('', ''), NULLIF('LO8', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์ใข้ความรู้ทาง วิทยาศาสตร์ คณิตศาสตร์และสถิติได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาที่ซับซ้อนได้อย่างครบถ้วน เสนอแนวทางแก้ไขที่สร้างสรรค์ สามารถสร้างนวัตกรรมการทำงานหรือแนวปฏิบัติที่ดีที่นำไปสู่การใช้งานได้จริง   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน เสนอแนะข้อเสนอแนวทางแก้ไขได้แต่ยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้ แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำ   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข (2)', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเลือกใช้เครื่องมือและเทคโนโลยีสารสนเทศที่เหมาะสมในการสืบค้นข้อมูลและความรู้ใหม่ สามารถรวบรวม วิเคราะห์ และสังเคราะห์ข้อมูล เพื่อหาข้อสรุปในการปฏิบัติงานในสถานประกอบการได้ |   5 (ยอดเยี่ยม): เลือกใช้เครื่องมือและเทคโนโลยีสารสนเทศในการรวมเรม วิเคราะห์ และ สังเคราะห์ข้อมูลได้อย่างถูกต้อง ครบถ้วน พร้อมข้อสรุปที่นวัตกรรมหรือการนำไปใช้ได้จริงเป็นรูปธรรม   4 (ดีมาก): รวบรวม วิเคราะห์ข้อมูลได้ดีในระดับที่เหมาะสม สังเคราะห์ข้อมูลพร้อมข้อสรุปที่เป็นประโยชน์ได้แต่ยังขาดความสมบูณ์ในบางองค์ประกอบ   3 (ดี): วิเคราะห์ข้อมูลได้ในระดับพื้นฐาน   2 (พอใช้): วิเคราะห์ข้อมูลได้เพียงบางส่วน และข้อสรุปยังไม่ชัดเจน ต้องการคำแนะนำ   1 (ต้องปรับปรุง): ไม่สามารถรวบรวม วิเคราะห์และสังเคราะห์ข้อมูลได้', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนอ่านและเขียนแบบทางวิศวกรรม เข้าใจหลักการทำงานของอุปกรณ์และกระบวนการการผลิตที่เกี่ยวข้องกับงานที่ได้รับมอบหมายจากสถานประกอบสหกิจศึกษาได้ |   5 (ยอดเยี่ยม): สามารถอ่านและเขียนแบบทางวิศวกรรม เข้าใจกระบวนการงานที่ได้รับมอบหมาย นำเสนอแนวทางในการปรับปรุงกระบวนการ สร้างสรรค์งานใหม่ได้   4 (ดีมาก): สามารถอ่านและเขียนแบบทางวิศวกรรม เข้าใจกระบวนการงานที่ได้รับมอบหมาย  นำเสนอแนวทางในการปรับปรุงกระบวนการ   3 (ดี): สามารถอ่านและเขียนแบบทางวิศวกรรม เข้าใจกระบวนการงานที่ได้รับมอบหมายในระดับพื้นฐาน   2 (พอใช้): สามารถอ่านและเขียนแบบทางวิศวกรรม เข้าใจกระบวนการงานที่ได้รับมอบหมายได้บ้าง แต่ยังอาจพบข้อผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่สามารถสามารถอ่านและเขียนแบบทางวิศวกรรม ไม่สามารถทำความเข้าใจกระบวนการงานที่ได้รับมอบหมายได้ในสถานการณ์จริง', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเพื่อวิเคราะห์และแก้ปัญหาทางวิศวกรรมเคมีและเคมีเภสัชกรรมโดยคำนึงถึงความปลอดภัย เศรษฐศาสตร์ การบริหารงานวิศวกรรม และผลกระทบทางสิ่งแวดล้อมและพลังงาน ในการปฏิบัติงานสหกิจศึกษาได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาโดยคำนึงถึงความปลอดภัย เศรษฐศาสตร์ การบริหารงานวิศวกรรม และผลกระทบทางสิ่งแวดล้อมและพลังงานได้อย่างมีประสิทธิภาพ นำไปสู่นวัตกรรมและการปรับปรุงประสิทธิภาพของระบบงาน สร้างแนวปฏิบัติที่ดีที่ชัดเจนเป็นรูปธรรม   4 (ดีมาก): สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาโดยคำนึงถึงความปลอดภัย เศรษฐศาสตร์ การบริหารงานวิศวกรรม และผลกระทบทางสิ่งแวดล้อมและพลังงานได้อย่างเหมาะสม มีข้อเสนอแนะที่นำไปสู่การปรับปรุงประสิทธิภาพของระบบงาน   3 (ดี): สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาได้อย่างเหมาะสม   2 (พอใช้): สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาได้ในระดับที่จำกัด   1 (ต้องปรับปรุง): ไม่สามารถประยุกต์ใช้ความรู้พื้นฐานทางวิศวกรรมเคมีและเคมีเภสัชกรรมเพื่อวิเคราะห์และแก้ปัญหาในการปฏิบัติงานสหกิจศึกษาได้', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้ |   5 (ยอดเยี่ยม): ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้อย่างดีเยี่ยม สร้างแนวปฏิบัติที่ดีที่ผู้อื่นนำไปประยุกต์ใช้ได้   4 (ดีมาก): ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้อย่างดี   3 (ดี): ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้อย่างเหมาะสม   2 (พอใช้): ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้อย่างในระดับที่จำกัด ต้องการการปรึกษาดูแลบ้าง   1 (ต้องปรับปรุง): ไม่ดูแลสุขภาพทางกายและจิตใจ และปรับตัวให้สอดคล้องกับสถานการณ์ทางสังคมและ สิ่งแวดล้อมที่มีการเปลี่ยนแปลงในสถานประกอบสหกิจศึกษาได้ ต้องการการดูแลอย่างใกล้ชิด (3)', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบและคำนึงถึงจริยธรรมและหลักวิชาชีพ |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบเป็นที่ประจักษ์   4 (ดีมาก): ปฏิบัติตามกฎระเบียบ มีความรับผิดชอบในงาน พบข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบและแสดงความรับผิดชอบในงานได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถติดต่อสื่อสารทั้งภาษาไทยและภาษาอังกฤษ และทำงานร่วมกับผู้อื่นได้ในการปฏิบัติงานสหกิจศึกษาได้อย่างมีประสิทธิภาพ |   5 (ยอดเยี่ยม): มีบทบาทสำคัญในทีม ช่วยสร้างสภาพแวดล้อมการทำงานที่ดี และแสดงภาวะผู้นำได้อย่างชัดเจน   4 (ดีมาก): ทำงานร่วมกับทีมได้ดีในระดับที่เหมาะสม และปฏิบัติงานตามบทบาทที่ได้รับอย่างสมบูรณ์   3 (ดี): ทำงานร่วมกับทีมได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางด้าน   2 (พอใช้): ทำงานร่วมกับทีมได้บางส่วน แต่มีปัญหาในการสื่อสารหรือการมีส่วนร่วม   1 (ต้องปรับปรุง): ไม่สามารถทำงานร่วมกับทีมได้อย่างเหมาะสม', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถแสวงหาความรู้ใหม่ที่ได้จากการปฏิบัติงานสหกิจศึกษาได้ |   5 (ยอดเยี่ยม): แสวงหาความรู้ใหม่เพื่อสนับสนุนการปฏิบัติงานสหกิจศึกษาได้เป็นอย่างดี สังเคราะห์ความรู้ใหม่จากการปฏิบัติงานสหกิจศึกษาได้โดยรวบรวมและนำเสนอองค์ความรู้ใหม่ได้อย่างครบถ้วนและเป็นระบบ   4 (ดีมาก): แสวงหาความรู้ใหม่เพื่อสนับสนุนการปฏิบัติงานสหกิจศึกษาได้เป็นอย่างดี รวบรวมและนำเสนอองค์ความรู้ใหม่ได้   3 (ดี): แสวงหา รวบรวม และนำเสนอองค์ความรู้ใหม่ได้ แต่ยังขาดความสมบูรณ์บางประเด็น   2 (พอใช้): แสวงหา รวบรวม และนำเสนอองค์ความรู้ใหม่ได้อย่างมีขีดจำกัด ต้องการคำแนะนำชี้แนะ   1 (ต้องปรับปรุง): ไม่แสวงหาความรู้ใหม่เพื่อสนับสนุนการปฏิบัติงานสหกิจศึกษาได้', NULLIF('', ''), NULLIF('LO8', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
END $$;

