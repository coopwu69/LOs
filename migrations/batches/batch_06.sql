DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิทยาศาสตร์การกีฬาและการออกก าลังกาย', NULLIF('1', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'แบบประเมินสหกิจศึกษาที่สอดคล้องกับ LOs รายวิชาสหกิจศึกษา (วิทย์กีฬา).pdf'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้ความรู้ด้านวิทยาศาสตร์การกีฬาและ ระดับดีมาก (ประยุกต์ใช้ความรู้ในการส่งเสริม การออกก าลังกายได้อย่างเหมาะสมกับการปฏิบัติงาน สุขภาพ และพัฒนาศักยภาพให้กับกลุ่มเป้าหมายได้ ถูกต้อง พร้อมอธิบายเหตุผลเชิงลึก) ระดับดี (ประยุกต์ใช้ความรู้ในการส่งเสริมสุขภาพ และพัฒนาศักยภาพให้กับกลุ่มเป้าหมายได้เหมาะสม ส่วนใหญ่ และอธิบายเหตุผลได้) ระดับพอใช้ (สามารถใช้ความรู้ในการส่งเสริม สุขภาพ และและพัฒนาศักยภาพให้กับกลุ่มเป้าหมาย ได้บางส่วน และอธิบายเหตุผลได้ไม่ครบถ้วน) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'วิเคราะห์และประเมินสมรรถภาพทางกายส าหรับ ระดับดีมาก (วิเคราะห์สมรรถภาพทางกายได้ จัดโปรแกรมการออกก าลังกายได้อย่างเหมาะสม ถูกต้องครบถ้วน ออกแบบโปรแกรมได้เหมาะสมกับ เป้าหมายและความต้องการเฉพาะบุคคล พร้อม อธิบายเหตุผลเชิงลึกได้) ระดับดี (วิเคราะห์สมรรถภาพได้ถูกต้องส่วนใหญ่ ออกแบบโปรแกรมได้เหมาะสมในภาพรวม และ อธิบายเหตุผลได้ครอบคลุม) ระดับพอใช ้ (วิเคราะห์สมรรถภาพได้บางส่วน ออกแบบโปรแกรมได้ในระดับพื้นฐาน และอธิบายเหตุ ผลได้เพียงบางส่วน) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการปฏิบัติทางวิทยาศาสตร์การกีฬาและ ระดับดีมาก (ปฏิบัติถูกต้องตามหลักวิชาการทุก การออกก าลังกายได้อย่างถูกต้องตามหลักวิชาการ ขั้นตอน และอธิบายเหตุผลได้ชัดเจน) ระดับดี (ปฏิบัติถูกต้องส่วนใหญ่ มีข้อผิดพลาด เล็กน้อย และอธิบายเหตุผลได้ครอบคลุม) 3 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน ระดับพอใช้ (ปฏิบัติถูกต้องบางส่วน และอธิบาย เหตุผลได้เพียงบางส่วน) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะในการใช้เครื่องมือทางวิทยาศาสตร์การกีฬา ระดับดีมาก (ใช้เครื่องมือได้ถูกต้องตามหลัก และการออกก าลังกายได้อย่างถูกต้องตามหลัก วิชาการทุกขั้นตอนและอธิบายการใช้งานได้เชิงลึก) วิชาการ ระดับดี (ใช้เครื่องมือได้ถูกต้องในส่วนใหญ่ มี ข้อผิดพลาดเล็กน้อยที่ไม่กระทบผลลัพธ์ และอธิบาย การใช้งานได้) ระดับพอใช้ (ใช้เครื่องมือถูกต้องบางส่วน มี ข้อผิดพลาดส าคัญ และอธิบายได้เพียงบางส่วน) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการสื่อสาร ระดับดีมาก (สามารถสื่อสาร การพูด การเขียน การน าเสนอ ได้อย่างเข้าใจง่าย เรียบร้อย ชัดเจน ถูกต้อง รู้จักสอบถามและชี้แจงผลการด าเนินงานและ ตอบค าถามได้ดี) ระดับดี (สามารถสื่อสาร การพูด การเขียน การ น าเสนอ ได้อย่างเข้าใจได้ง่าย เรียบร้อย ชัดเจน ถูกต้อง) ระดับพอใช้ (สามารถสื่อสาร การพูด การเขียน การน าเสนอได้) ระดับควรปรับปรุง (ไม่แสดงออกถึงผลการเรียนรู้ ดังกล่าว ควรปรับปรุง)', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีความซื่อสัตย์ สุจริต เคารพต่อกฎระเบียบของ ระดับดีมาก (ปฏิบัติตามทุกกฎระเบียบและ องค์กร นโยบายขององค์กรอย่างเคร่งครัด ไม่มีการละเมิดหรือ ทุจริต) 4 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน ระดับดี (ปฏิบัติตามกฎระเบียบและนโยบายส่วน ใหญ่ อาจมีการละเมิดบ้างในบางครั้งแต่ไม่เป็นปัญหา ร้ายแรง) ระดับพอใช้ (มีการปฏิบัติตามกฎระเบียบและ นโยบายบางประการ แต่บางครั้งอาจละเลยหรือ ละเมิดกฎระเบียบ) ระดับควรปรับปรุง (มีการละเมิดกฎระเบียบและ นโยบายอย่างสม่ าเสมอ มีการกระท าที่ไม่ซื่อสัตย์หรือ ทุจริต)', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีความรับผิดชอบต่องานที่ได้รับมอบหมาย ส่งงาน ระดับดีมาก (ส่งงานทั้งหมดตามก าหนดเวลาที่ ที่ได้รับมอบหมายตรงเวลา ก าหนดเสมอ มีการวางแผนและจัดการเวลาได้อย่างมี ประสิทธิภาพ งานที่ส่งมอบมีคุณภาพสูง ตรงตาม ความคาดหวัง) ระดับดี (ส่งงานตามก าหนดเวลาเกือบทั้งหมด อาจมีการล่าช้าเล็กน้อยบางครั้ง แต่สามารถจัดการ เวลาได้ดี ส่งมอบมีคุณภาพดี ตรงตามข้อก าหนดส่วน ใหญ่ แต่ มีข้อผิดพลาดเล็กน้อยที่สามารถแก้ไขได้) ระดับพอใช้ (มีการล่าช้าในการส่งงานบ้าง ส่งงาน ไม่ตรงเวลาตามก าหนดบางครั้ง คุณภาพพอใช้) ระดับควรปรับปรุง (ส่งงานล่าช้าอยู่เสมอ หรือไม่ สามารถปฏิบัติตามก าหนดเวลาได้ตามที่ต้องการ คุณภาพต่ า มีข้อผิดพลาดหรือข้อบกพร่องมากมายที่ ต้องการการแก้ไขอย่างเร่งด่วน)', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'เคารพสิทธิ์และรับฟังความคิดเห็นของผู้อื่น ระดับดีมาก (แสดงความเคารพต่อสิทธิและความ คิดเห็นของผู้อื่นเสมอ ฟังความคิดเห็นอย่างเต็มที่และ ให้ความส าคัญกับมุมมองที่แตกต่าง) ระดับดี (แสดงความเคารพต่อสิทธิและความ คิดเห็นของผู้อื่นในระดับดี ฟังความคิดเห็นและ พิจารณามุมมองที่แตกต่างได้ดี) 5 ผลลัพธ์การเรียนรู้ที่คาดหวัง ผลการประเมิน ระดับพอใช้ (เคารพสิทธิและความคิดเห็นของ ผู้อื่นบางครั้ง แต่บางครั้งอาจมีการแสดงออกที่ไม่เต็มที่ หรือ ขาดความใส่ใจ) ระดับควรปรับปรุง (ขาดความเคารพต่อสิทธิและ ความคิดเห็นของผู้อื่น มักไม่ฟังความคิดเห็นหรือไม่ให้ ความส าคัญกับมุมมองที่แตกต่าง) 6', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;

