DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรบริหารธุรกิจบัณฑิต หลักสูตรนานาชาติ (หลักสูตรปรับปรุง พ.ศ. 2565)', 'Showing discipline, honesty, punctuality, and social mindfulness', 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรบริหารธุรกิจบัณฑิต หลักสูตรนานาชาติ (หลักสูตรปรับปรุง พ.ศ. 2565) (1).docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์หลักการทางบริหารธุรกิจได้อย่างเหมาะสม', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถรวบรวม วิเคราะห์ และแปลผลข้อมูลจากการปฏิบัติงานในสถานประกอบการ เพื่อหาข้อสรุปที่เป็นประโยชน์', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ผู้เรียนสามารถสื่อสารกับเพื่อนร่วมงานและบุคคลในสถานประกอบการด้วยภาษาอังกฤษได้อย่างเหมาะสม เพื่อให้การทำงานสำเร็จลุล่วงตามเป้าหมาย', NULL, 'LO3', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเรียนรู้และพัฒนาทักษะใหม่ที่เกี่ยวข้องกับงานในสถานประกอบการด้วยตนเอง', NULL, 'LO4', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบและคำนึงถึงจริยธรรมในวิชาชีพ โดยพิจารณาผลกระทบต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม', NULL, 'LO5', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีม ได้อย่างมีประสิทธิภาพ พร้อมทั้งแสดงบทบาทความเป็นผู้นำและการร่วมมือที่ดีตามสถานะของตนเองในทีม ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์หลักการทางบริหารธุรกิจได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาที่ซับซ้อนได้อย่างครบถ้วน พร้อมเสนอแนวทางแก้ไขที่สร้างสรรค์ มีประสิทธิภาพสูง และตอบโจทย์ความต้องการของสถานประกอบการได้อย่างสมบูรณ์   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อยแต่ไม่กระทบต่อคุณภาพโดยรวม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้บางส่วน แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข (2)', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถรวบรวม วิเคราะห์ และแปลผลข้อมูลจากการปฏิบัติงานในสถานประกอบการได้ |   5 (ยอดเยี่ยม): วิเคราะห์ข้อมูลได้อย่างถูกต้อง ครบถ้วน และแปลผลได้ชัดเจน พร้อมข้อสรุปที่นำไปใช้ได้จริง   4 (ดีมาก): วิเคราะห์ข้อมูลได้ดีในระดับที่เหมาะสม พร้อมข้อสรุปที่เป็นประโยชน์ แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): วิเคราะห์ข้อมูลได้ในระดับพื้นฐาน แต่ข้อสรุปยังขาดความชัดเจนและความสมบูรณ์ในบางส่วน   2 (พอใช้): วิเคราะห์ข้อมูลได้เพียงบางส่วน และข้อสรุปยังไม่ชัดเจน ต้องการคำแนะนำเพิ่มเติม   1 (ต้องปรับปรุง): ไม่สามารถวิเคราะห์ข้อมูลหรือแปลผลได้', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารกับเพื่อนร่วมงานและบุคคลในสถานประกอบการด้วยภาษาอังกฤษได้ |   5 (ยอดเยี่ยม): สื่อสารได้ชัดเจน เข้าใจง่าย ใช้ภาษาอังกฤษได้อย่างเหมาะสมกับสถานการณ์   4 (ดีมาก): สื่อสารได้ดีในระดับที่เหมาะสม แม้จะมีข้อผิดพลาดเล็กน้อยที่ไม่กระทบต่อการทำงาน   3 (ดี): สื่อสารได้ในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดหรือจุดที่ไม่ชัดเจนในบางสถานการณ์   2 (พอใช้): สื่อสารได้บ้าง แต่ยังไม่เหมาะสมกับสถานการณ์หรือมีข้อผิดพลาดที่ส่งผลต่อการทำงาน   1 (ต้องปรับปรุง): ไม่สามารถสื่อสารได้อย่างเหมาะสมในสถานการณ์จริง', NULL, 'LO3', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถเรียนรู้และพัฒนาทักษะใหม่ที่เกี่ยวข้องกับงานในสถานประกอบการด้วยตนเอง |   5 (ยอดเยี่ยม): นักศึกษาสามารถเรียนรู้ทักษะใหม่ได้อย่างรวดเร็วและนำไปประยุกต์ใช้ในงานได้อย่างมีประสิทธิภาพ มีการริเริ่มในการศึกษาข้อมูลเพิ่มเติมด้วยตัวเอง และแสดงผลลัพธ์ที่ชัดเจน   4 (ดีมาก): นักศึกษาสามารถเรียนรู้ทักษะใหม่ได้ดี และสามารถนำไปใช้ในงานได้ในระดับที่เหมาะสม แม้จะมีการปรับปรุงในบางส่วน   3 (ดี): นักศึกษาสามารถเรียนรู้ทักษะใหม่ได้ในระดับพื้นฐาน และเริ่มต้นนำไปใช้ในงานบางส่วน แต่ยังขาดความสมบูรณ์   2 (พอใช้): นักศึกษาสามารถเรียนรู้ทักษะใหม่ได้ในระดับที่จำกัด และยังไม่สามารถประยุกต์ใช้ได้อย่างเหมาะสม   1 (ต้องปรับปรุง): นักศึกษาไม่สามารถเรียนรู้ทักษะใหม่ได้ด้วยตนเอง และขาดความพยายามในการพัฒนาตนเอง (3)', NULL, 'LO4', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานด้วยความรับผิดชอบและคำนึงถึงจริยธรรมในวิชาชีพ |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบอย่างชัดเจน   4 (ดีมาก): ปฏิบัติตามกฎระเบียบส่วนใหญ่ และแสดงความรับผิดชอบในงานได้ดี แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULL, 'LO5', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีม ได้อย่างมีประสิทธิภาพ พร้อมทั้งแสดงบทบาทความเป็นผู้นำและการร่วมมือที่ดี |   5 (ยอดเยี่ยม): มีบทบาทสำคัญในทีม ช่วยสร้างสภาพแวดล้อมการทำงานที่ดี และแสดงภาวะผู้นำได้อย่างชัดเจน   4 (ดีมาก): ทำงานร่วมกับทีมได้ดีในระดับที่เหมาะสม และปฏิบัติงานตามบทบาทที่ได้รับอย่างสมบูรณ์   3 (ดี): ทำงานร่วมกับทีมได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางด้าน   2 (พอใช้): ทำงานร่วมกับทีมได้บางส่วน แต่มีปัญหาในการสื่อสารหรือการมีส่วนร่วม   1 (ต้องปรับปรุง): ไม่สามารถทำงานร่วมกับทีมได้อย่างเหมาะสม', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิทยาศาสตร์การกีฬาและการออกก าลังกาย', '1', 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'แบบประเมินสหกิจศึกษาที่สอดคล้องกับ LOs รายวิชาสหกิจศึกษา (วิทย์กีฬา).pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้ความรู้ด้านวิทยาศาสตร์การกีฬาและ ระดับดีมาก (ประยุกต์ใช้ความรู้ในการส่งเสริม การออกก าลังกายได้อย่างเหมาะสมกับการปฏิบัติงาน สุขภาพ และพัฒนาศักยภาพให้กับกลุ่มเป้าหมายได้ ถูกต้อง พร้อมอธิบายเหตุผลเชิงลึก) ระดับดี (ประยุกต์ใช้ความรู้ในการส่งเสริมสุขภาพ และพัฒนาศักยภาพให้กับกลุ่มเป้าหมายได้เหมาะสม ส่วนใหญ่ และอธิบายเหตุผลได้) ระดับพอใช้ (สามารถใช้ความรู้ในการส่งเสริม สุขภาพ และและพัฒนาศักยภาพให้กับกลุ่มเป้าหมาย ได้บางส่วน และอธิบายเหตุผลได้ไม่ครบถ้วน) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'วิเคราะห์และประเมินสมรรถภาพทางกายส าหรับ ระดับดีมาก (วิเคราะห์สมรรถภาพทางกายได้ จัดโปรแกรมการออกก าลังกายได้อย่างเหมาะสม ถูกต้องครบถ้วน ออกแบบโปรแกรมได้เหมาะสมกับ เป้าหมายและความต้องการเฉพาะบุคคล พร้อม อธิบายเหตุผลเชิงลึกได้) ระดับดี (วิเคราะห์สมรรถภาพได้ถูกต้องส่วนใหญ่ ออกแบบโปรแกรมได้เหมาะสมในภาพรวม และ อธิบายเหตุผลได้ครอบคลุม) ระดับพอใช ้ (วิเคราะห์สมรรถภาพได้บางส่วน ออกแบบโปรแกรมได้ในระดับพื้นฐาน และอธิบายเหตุ ผลได้เพียงบางส่วน) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULL, NULL, 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการปฏิบัติทางวิทยาศาสตร์การกีฬาและ ระดับดีมาก (ปฏิบัติถูกต้องตามหลักวิชาการทุก การออกก าลังกายได้อย่างถูกต้องตามหลักวิชาการ ขั้นตอน และอธิบายเหตุผลได้ชัดเจน) ระดับดี (ปฏิบัติถูกต้องส่วนใหญ่ มีข้อผิดพลาด เล็กน้อย และอธิบายเหตุผลได้ครอบคลุม) 3 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน ระดับพอใช้ (ปฏิบัติถูกต้องบางส่วน และอธิบาย เหตุผลได้เพียงบางส่วน) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะในการใช้เครื่องมือทางวิทยาศาสตร์การกีฬา ระดับดีมาก (ใช้เครื่องมือได้ถูกต้องตามหลัก และการออกก าลังกายได้อย่างถูกต้องตามหลัก วิชาการทุกขั้นตอนและอธิบายการใช้งานได้เชิงลึก) วิชาการ ระดับดี (ใช้เครื่องมือได้ถูกต้องในส่วนใหญ่ มี ข้อผิดพลาดเล็กน้อยที่ไม่กระทบผลลัพธ์ และอธิบาย การใช้งานได้) ระดับพอใช้ (ใช้เครื่องมือถูกต้องบางส่วน มี ข้อผิดพลาดส าคัญ และอธิบายได้เพียงบางส่วน) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULL, NULL, 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการสื่อสาร ระดับดีมาก (สามารถสื่อสาร การพูด การเขียน การน าเสนอ ได้อย่างเข้าใจง่าย เรียบร้อย ชัดเจน ถูกต้อง รู้จักสอบถามและชี้แจงผลการด าเนินงานและ ตอบค าถามได้ดี) ระดับดี (สามารถสื่อสาร การพูด การเขียน การ น าเสนอ ได้อย่างเข้าใจได้ง่าย เรียบร้อย ชัดเจน ถูกต้อง) ระดับพอใช้ (สามารถสื่อสาร การพูด การเขียน การน าเสนอได้) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULL, NULL, 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีความซื่อสัตย์ สุจริต เคารพต่อกฎระเบียบของ ระดับดีมาก (ปฏิบัติตามทุกกฎระเบียบและ องค์กร นโยบายขององค์กรอย่างเคร่งครัด ไม่มีการละเมิดหรือ ทุจริต) 4 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน ระดับดี (ปฏิบัติตามกฎระเบียบและนโยบายส่วน ใหญ่ อาจมีการละเมิดบ้างในบางครั้งแต่ไม่เป็นปัญหา ร้ายแรง) ระดับพอใช้ (มีการปฏิบัติตามกฎระเบียบและ นโยบายบางประการ แต่บางครั้งอาจละเลยหรือ ละเมิดกฎระเบียบ) ระดับควรปรับปรุง (มีการละเมิดกฎระเบียบและ นโยบายอย่างสม่ าเสมอ มีการกระท าที่ไม่ซื่อสัตย์หรือ ทุจริต)', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีความรับผิดชอบต่องานที่ได้รับมอบหมาย ส่งงาน ระดับดีมาก (ส่งงานทั้งหมดตามก าหนดเวลาที่ ที่ได้รับมอบหมายตรงเวลา ก าหนดเสมอ มีการวางแผนและจัดการเวลาได้อย่างมี ประสิทธิภาพ งานที่ส่งมอบมีคุณภาพสูง ตรงตาม ความคาดหวัง) ระดับดี (ส่งงานตามก าหนดเวลาเกือบทั้งหมด อาจมีการล่าช้าเล็กน้อยบางครั้ง แต่สามารถจัดการ เวลาได้ดี ส่งมอบมีคุณภาพดี ตรงตามข้อก าหนดส่วน ใหญ่ แต่ มีข้อผิดพลาดเล็กน้อยที่สามารถแก้ไขได้) ระดับพอใช้ (มีการล่าช้าในการส่งงานบ้าง ส่งงาน ไม่ตรงเวลาตามก าหนดบางครั้ง คุณภาพพอใช้) ระดับควรปรับปรุง (ส่งงานล่าช้าอยู่เสมอ หรือไม่ สามารถปฏิบัติตามก าหนดเวลาได้ตามที่ต้องการ คุณภาพต่ า มีข้อผิดพลาดหรือข้อบกพร่องมากมายที่ ต้องการการแก้ไขอย่างเร่งด่วน)', NULL, NULL, 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'เคารพสิทธิ์และรับฟังความคิดเห็นของผู้อื่น ระดับดีมาก (แสดงความเคารพต่อสิทธิและความ คิดเห็นของผู้อื่นเสมอ ฟังความคิดเห็นอย่างเต็มที่และ ให้ความส าคัญกับมุมมองที่แตกต่าง) ระดับดี (แสดงความเคารพต่อสิทธิและความ คิดเห็นของผู้อื่นในระดับดี ฟังความคิดเห็นและ พิจารณามุมมองที่แตกต่างได้ดี) 5 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน ระดับพอใช้ (เคารพสิทธิและความคิดเห็นของ ผู้อื่นบางครั้ง แต่บางครั้งอาจมีการแสดงออกที่ไม่เต็มที่ หรือ ขาดความใส่ใจ) ระดับควรปรับปรุง (ขาดความเคารพต่อสิทธิและ ความคิดเห็นของผู้อื่น มักไม่ฟังความคิดเห็นหรือไม่ให้ ความส าคัญกับมุมมองที่แตกต่าง) 6', NULL, NULL, 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, '☑ ระดับดี (สามารถวางแผน แก้ไขปัญหา และสร้างสรรค์ผลงานได้ โดยมีการดูแลจากผู้นิเทศในบางครั้ง)', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.91, true
  FROM public.assessment_source_documents sd WHERE sd.filename = '1.ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรนิเทศศาสตร์.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ประยุกต์ใช้ความรู้ด้านนิเทศศาสตร์ เพื่อวางแผนและแก้ไขปัญหาในการสร้างสรรค์และผลิตสื่อ หรือการสื่อสารองค์กรดิจิทัลและอีเว้นท์ (ขึ้นอยู่กับวิชาโทที่ผู้เรียนเลือก) ในสถานประกอบการได้ | ☑ ระดับดีมาก (สามารถวางแผน แก้ไขปัญหา และสร้างสรรค์ผลงานได้อย่างมีประสิทธิภาพโดยไม่ต้องการการดูแลเพิ่มเติม) ☑ ระดับดี (สามารถวางแผน แก้ไขปัญหา และสร้างสรรค์ผลงานได้ โดยมีการดูแลจากผู้นิเทศในบางครั้ง) ☑ ระดับพอใช้ (สามารถดำเนินงานได้แต่ต้องการการดูแลใกล้ชิดจากผู้นิเทศ) ☑ ระดับควรปรับปรุง (ไม่สามารถดำเนินงานตามผลลัพธ์ที่คาดหวังได้)', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ประยุกต์ใช้แนวคิดการรู้เท่าทันสื่อและวิเคราะห์ข้อมูลข่าวสาร เพื่อนำไปใช้ในการสร้างสรรค์ผลงานในสถานประกอบการได้ | ☑ ระดับดีมาก (สามารถนำความรู้เท่าทันสื่อและวิเคราะห์ข้อมูลข่าวสารมาใช้ได้อย่างมีประสิทธิภาพ) ☑ ระดับดี (สามารถนำแนวคิดการรู้เท่าทันสื่อไปใช้งานได้ แต่ต้องการการสนับสนุนบางครั้ง) ☑ ระดับพอใช้ (มีพื้นฐานแต่ต้องการคำแนะนำอย่างต่อเนื่อง) ☑ ระดับควรปรับปรุง (ยังไม่สามารถใช้แนวคิดได้)', NULL, 'LO2', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการใช้นวัตกรรมการสื่อสารและเทคโนโลยีสื่อดิจิทัลได้ตรงตามความต้องการขององค์กรและอุตสาหกรรมสื่อดิจิทัลได้ | ☑ ระดับดีมาก (สามารถใช้นวัตกรรมและเทคโนโลยีสื่อดิจิทัลได้อย่างเชี่ยวชาญและเหมาะสมกับงาน) ☑ ระดับดี (ใช้นวัตกรรมและเทคโนโลยีได้ดี แต่ต้องการคำแนะนำในบางครั้ง) ☑ ระดับพอใช้ (สามารถใช้งานได้ในระดับพื้นฐาน) ☑ ระดับควรปรับปรุง (ยังไม่สามารถใช้งานได้อย่างเหมาะสม)', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะในการผลิตเนื้อหาหลากหลายรูปแบบบนมัลติแพลตฟอร์ม เพื่อตอบสนองต่อองค์กรและอุตสาหกรรมสื่อดิจิทัล | ☑ ระดับดีมาก (ผลิตเนื้อหาได้หลากหลายรูปแบบและเหมาะสมกับแพลตฟอร์มต่าง ๆ) ☑ ระดับดี (ผลิตเนื้อหาได้ดีในบางแพลตฟอร์ม แต่ต้องการคำแนะนำเพิ่มเติม) ☑ ระดับพอใช้ (ผลิตเนื้อหาได้พื้นฐานแต่ยังไม่หลากหลาย) ☑ ระดับควรปรับปรุง (ยังไม่สามารถผลิตเนื้อหาได้ตามที่คาดหวัง)', NULL, 'LO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการนำเสนอเพื่อโน้มน้าวใจในการเจรจาต่อรองสำหรับงานด้านนิเทศศาสตร์ | ☑ ระดับดีมาก (นำเสนอได้ชัดเจนและโน้มน้าวใจอย่างมีประสิทธิภาพ) ☑ ระดับดี (นำเสนอได้ดีแต่ต้องการการปรับปรุงบางจุด) ☑ ระดับพอใช้ (สามารถนำเสนอได้ในระดับพื้นฐาน) ☑ ระดับควรปรับปรุง (ยังไม่สามารถนำเสนอได้อย่างชัดเจน)', NULL, 'LO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงความซื่อสัตย์ มีความกตัญญู เคารพต่อกฎระเบียบ มีความรับผิดชอบต่อตนเองและสังคม และยึดมั่นตามหลักจรรยาวิชาชีพสื่อ | ☑ ระดับดีมาก (ปฏิบัติตามจรรยาบรรณอย่างเคร่งครัดและแสดงความรับผิดชอบได้อย่างดีเยี่ยม) ☑ ระดับดี (ปฏิบัติตามจรรยาบรรณได้ดี แต่ต้องการการกระตุ้นเพิ่มเติมในบางเรื่อง) ☑ ระดับพอใช้ (ปฏิบัติได้ในระดับพื้นฐาน) ☑ ระดับควรปรับปรุง (ยังไม่สามารถปฏิบัติตามจรรยาบรรณได้)', NULL, 'LO6', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการมีวินัย การมีภาวะผู้นำ สามารถเป็นได้ทั้งผู้นำและผู้ตาม สามารถทำงานเป็นทีมและยอมรับความแตกต่างทางความคิดเห็นของผู้อื่น | ☑ ระดับดีมาก (แสดงความเป็นผู้นำและผู้ตามได้ดีเยี่ยม สามารถทำงานเป็นทีมอย่างมีประสิทธิภาพ) ☑ ระดับดี (ทำงานร่วมกับทีมได้ดี แต่ยังต้องการการพัฒนาในบางเรื่อง) ☑ ระดับพอใช้ (ทำงานร่วมกับทีมได้ในระดับพื้นฐาน) ☑ ระดับควรปรับปรุง (ยังไม่สามารถทำงานเป็นทีมได้อย่างมีประสิทธิภาพ)', NULL, 'LO7', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรเทคโนโลยีดิจิทัลทางการแพทย์', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.96, true
  FROM public.assessment_source_documents sd WHERE sd.filename = '2.ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรเทคโนโลยีดิจิทัลทางการแพทย์ พ.ศ.67.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์ความรู้ในการพัฒนาระบบงานด้านปัญญาประดิษฐ์ทางการแพทย์ หรือ นวัตกรรมการแพทย์ดิจิทัล ได้อย่างเหมาะสมกับความต้องการของผู้ใช้', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถรวบรวม วิเคราะห์ และแปลผลข้อมูลจากการปฏิบัติงานในสถานประกอบการ พัฒนาระบบงาน หรือแก้ปัญหา หรือสร้างนวัตกรรมทางการแพทย์และสุขภาพ ด้วยเทคโนโลยีดิจิทัล', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ':  ผู้เรียนสามารถปฏิบัติงานตามกฎระเบียบของสถานประกอบการด้วยความรับผิดชอบและคำนึงถึงจริยธรรมในวิชาชีพ โดยพิจารณาผลกระทบต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีม ได้อย่างมีประสิทธิภาพ มีความคิดริเริ่ม กำหนดเป้าหมาย วางแผน ปฏิบัติงานด้วยตนเอง พร้อมทั้งแสดงบทบาทความเป็นผู้นำและผู้ตามที่ดีตามสถานะของตนเองในทีม ผลการเรียนรู้ที่คาดหวัง | ผลการประเมิน (1)', NULL, 'LO4', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 5)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์ความรู้ในการพัฒนาระบบงานด้านปัญญาประดิษฐ์ทางการแพทย์ หรือ นวัตกรรมการแพทย์ดิจิทัล ได้อย่างเหมาะสมกับความต้องการของผู้ใช้ |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาได้อย่างครบถ้วน พร้อมเสนอแนวทางแก้ไขที่สร้างสรรค์ มีประสิทธิภาพสูง และตอบโจทย์ความต้องการของสถานประกอบการได้ตรงกับความต้องการของหน่วยงาน   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อยแต่ไม่กระทบต่อคุณภาพโดยรวม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้บางส่วน แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข (2)', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถรวบรวม วิเคราะห์ และแปลผลข้อมูลจากการปฏิบัติงานในสถานประกอบการ พัฒนาระบบงาน หรือแก้ปัญหา หรือสร้างนวัตกรรมทางการแพทย์และสุขภาพ ด้วยเทคโนโลยีดิจิทัล |   5 (ยอดเยี่ยม): วิเคราะห์ข้อมูลได้อย่างถูกต้อง ครบถ้วน และแปลผลได้ชัดเจน พร้อมข้อสรุปที่นำไปใช้ได้จริง   4 (ดีมาก): วิเคราะห์ข้อมูลได้ดีในระดับที่เหมาะสม พร้อมข้อสรุปที่เป็นประโยชน์ แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): วิเคราะห์ข้อมูลได้ในระดับพื้นฐาน แต่ข้อสรุปยังขาดความชัดเจนและสมบูรณ์ในบางส่วน   2 (พอใช้): วิเคราะห์ข้อมูลได้เพียงบางส่วน และข้อสรุปยังไม่ชัดเจน ต้องการคำแนะนำเพิ่มเติม   1 (ต้องปรับปรุง): ไม่สามารถวิเคราะห์ข้อมูลหรือแปลผลได้ (3)', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 7)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถปฏิบัติงานตามกฎระเบียบของสถานประกอบการด้วยความรับผิดชอบและคำนึงถึงจริยธรรมในวิชาชีพ โดยพิจารณาผลกระทบต่อเศรษฐกิจ สังคม และสิ่งแวดล้อม |   5 (ยอดเยี่ยม): ปฏิบัติตามกฎระเบียบทุกข้ออย่างเคร่งครัด พร้อมแสดงความซื่อสัตย์และความรับผิดชอบอย่างชัดเจน   4 (ดีมาก): ปฏิบัติตามกฎระเบียบส่วนใหญ่ และแสดงความรับผิดชอบในงานได้ดี แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): ปฏิบัติตามกฎระเบียบได้ในระดับพื้นฐาน แต่ยังต้องการการปรับปรุงในบางส่วน   2 (พอใช้): ปฏิบัติตามกฎระเบียบได้เพียงบางข้อ และยังมีการละเลยหรือผิดพลาดบ้าง   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามกฎระเบียบ และแสดงถึงความขาดความรับผิดชอบในงาน (4)', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 8)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถทำงานร่วมกับทีม ได้อย่างมีประสิทธิภาพ มีความคิดริเริ่ม กำหนดเป้าหมาย วางแผน ปฏิบัติงานด้วยตนเอง พร้อมทั้งแสดงบทบาทความเป็นผู้นำและผู้ตามที่ดีตามสถานะของตนเองในทีม |   5 (ยอดเยี่ยม): มีบทบาทสำคัญในทีม มีความคิดริเริ่ม มีการกำหนดเป้าหมายของงาน รวมทั้งวางแผนการทำงานได้ด้วยตนเอง ช่วยสร้างสภาพแวดล้อมการทำงานที่ดี และแสดงภาวะผู้นำได้อย่างชัดเจน   4 (ดีมาก): ทำงานร่วมกับทีมได้ดีในระดับที่เหมาะสม และปฏิบัติงานตามบทบาทที่ได้รับอย่างสมบูรณ์   3 (ดี): ทำงานร่วมกับทีมได้ในระดับพื้นฐาน แต่ยังต้องปรับปรุงในบางด้าน   2 (พอใช้): ทำงานร่วมกับทีมได้บางส่วน แต่มีปัญหาในการสื่อสารหรือการมีส่วนร่วม   1 (ต้องปรับปรุง): ไม่สามารถทำงานร่วมกับทีมได้อย่างเหมาะสม', NULL, 'LO4', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;

