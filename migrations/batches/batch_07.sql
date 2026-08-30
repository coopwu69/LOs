DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, '☑ ระดับดี (สามารถวางแผน แก้ไขปัญหา และสร้างสรรค์ผลงานได้ โดยมีการดูแลจากผู้นิเทศในบางครั้ง)', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.91, true
  FROM public.assessment_source_documents sd WHERE sd.filename = '1.ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรนิเทศศาสตร์.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ประยุกต์ใช้ความรู้ด้านนิเทศศาสตร์ เพื่อวางแผนและแก้ไขปัญหาในการสร้างสรรค์และผลิตสื่อ หรือการสื่อสารองค์กรดิจิทัลและอีเว้นท์ (ขึ้นอยู่กับวิชาโทที่ผู้เรียนเลือก) ในสถานประกอบการได้ | ☑ ระดับดีมาก (สามารถวางแผน แก้ไขปัญหา และสร้างสรรค์ผลงานได้อย่างมีประสิทธิภาพโดยไม่ต้องการการดูแลเพิ่มเติม) ☑ ระดับดี (สามารถวางแผน แก้ไขปัญหา และสร้างสรรค์ผลงานได้ โดยมีการดูแลจากผู้นิเทศในบางครั้ง) ☑ ระดับพอใช้ (สามารถดำเนินงานได้แต่ต้องการการดูแลใกล้ชิดจากผู้นิเทศ) ☑ ระดับควรปรับปรุง (ไม่สามารถดำเนินงานตามผลลัพธ์ที่คาดหวังได้)', NULLIF('', ''), NULLIF('LO1', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ประยุกต์ใช้แนวคิดการรู้เท่าทันสื่อและวิเคราะห์ข้อมูลข่าวสาร เพื่อนำไปใช้ในการสร้างสรรค์ผลงานในสถานประกอบการได้ | ☑ ระดับดีมาก (สามารถนำความรู้เท่าทันสื่อและวิเคราะห์ข้อมูลข่าวสารมาใช้ได้อย่างมีประสิทธิภาพ) ☑ ระดับดี (สามารถนำแนวคิดการรู้เท่าทันสื่อไปใช้งานได้ แต่ต้องการการสนับสนุนบางครั้ง) ☑ ระดับพอใช้ (มีพื้นฐานแต่ต้องการคำแนะนำอย่างต่อเนื่อง) ☑ ระดับควรปรับปรุง (ยังไม่สามารถใช้แนวคิดได้)', NULLIF('', ''), NULLIF('LO2', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการใช้นวัตกรรมการสื่อสารและเทคโนโลยีสื่อดิจิทัลได้ตรงตามความต้องการขององค์กรและอุตสาหกรรมสื่อดิจิทัลได้ | ☑ ระดับดีมาก (สามารถใช้นวัตกรรมและเทคโนโลยีสื่อดิจิทัลได้อย่างเชี่ยวชาญและเหมาะสมกับงาน) ☑ ระดับดี (ใช้นวัตกรรมและเทคโนโลยีได้ดี แต่ต้องการคำแนะนำในบางครั้ง) ☑ ระดับพอใช้ (สามารถใช้งานได้ในระดับพื้นฐาน) ☑ ระดับควรปรับปรุง (ยังไม่สามารถใช้งานได้อย่างเหมาะสม)', NULLIF('', ''), NULLIF('LO3', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะในการผลิตเนื้อหาหลากหลายรูปแบบบนมัลติแพลตฟอร์ม เพื่อตอบสนองต่อองค์กรและอุตสาหกรรมสื่อดิจิทัล | ☑ ระดับดีมาก (ผลิตเนื้อหาได้หลากหลายรูปแบบและเหมาะสมกับแพลตฟอร์มต่าง ๆ) ☑ ระดับดี (ผลิตเนื้อหาได้ดีในบางแพลตฟอร์ม แต่ต้องการคำแนะนำเพิ่มเติม) ☑ ระดับพอใช้ (ผลิตเนื้อหาได้พื้นฐานแต่ยังไม่หลากหลาย) ☑ ระดับควรปรับปรุง (ยังไม่สามารถผลิตเนื้อหาได้ตามที่คาดหวัง)', NULLIF('', ''), NULLIF('LO4', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': มีทักษะการนำเสนอเพื่อโน้มน้าวใจในการเจรจาต่อรองสำหรับงานด้านนิเทศศาสตร์ | ☑ ระดับดีมาก (นำเสนอได้ชัดเจนและโน้มน้าวใจอย่างมีประสิทธิภาพ) ☑ ระดับดี (นำเสนอได้ดีแต่ต้องการการปรับปรุงบางจุด) ☑ ระดับพอใช้ (สามารถนำเสนอได้ในระดับพื้นฐาน) ☑ ระดับควรปรับปรุง (ยังไม่สามารถนำเสนอได้อย่างชัดเจน)', NULLIF('', ''), NULLIF('LO5', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงความซื่อสัตย์ มีความกตัญญู เคารพต่อกฎระเบียบ มีความรับผิดชอบต่อตนเองและสังคม และยึดมั่นตามหลักจรรยาวิชาชีพสื่อ | ☑ ระดับดีมาก (ปฏิบัติตามจรรยาบรรณอย่างเคร่งครัดและแสดงความรับผิดชอบได้อย่างดีเยี่ยม) ☑ ระดับดี (ปฏิบัติตามจรรยาบรรณได้ดี แต่ต้องการการกระตุ้นเพิ่มเติมในบางเรื่อง) ☑ ระดับพอใช้ (ปฏิบัติได้ในระดับพื้นฐาน) ☑ ระดับควรปรับปรุง (ยังไม่สามารถปฏิบัติตามจรรยาบรรณได้)', NULLIF('', ''), NULLIF('LO6', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': แสดงออกถึงการมีวินัย การมีภาวะผู้นำ สามารถเป็นได้ทั้งผู้นำและผู้ตาม สามารถทำงานเป็นทีมและยอมรับความแตกต่างทางความคิดเห็นของผู้อื่น | ☑ ระดับดีมาก (แสดงความเป็นผู้นำและผู้ตามได้ดีเยี่ยม สามารถทำงานเป็นทีมอย่างมีประสิทธิภาพ) ☑ ระดับดี (ทำงานร่วมกับทีมได้ดี แต่ยังต้องการการพัฒนาในบางเรื่อง) ☑ ระดับพอใช้ (ทำงานร่วมกับทีมได้ในระดับพื้นฐาน) ☑ ระดับควรปรับปรุง (ยังไม่สามารถทำงานเป็นทีมได้อย่างมีประสิทธิภาพ)', NULLIF('', ''), NULLIF('LO7', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;

