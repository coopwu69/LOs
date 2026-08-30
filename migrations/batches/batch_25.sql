DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  -- Create template
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรบริหารธุรกิจบัณฑิต สาขาการจัดการโลจิสติกส์', NULLIF('', ''), 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'แบบประเมินรายวิชาสหกิจศึกษาตาม LO หลักสูตรการจัดการโลจิสติกส์_ส่ง.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  -- Section: ด้านความรู้ (Knowledge)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULLIF('', ''), 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'การประยุกต์ใช้ความรู้ด้านการจัดการโลจิสติกส์ และเครื่องมือทางโลจิสติกส์ ในการทำงาน วางแผนแก้ปัญหาหรือปรับปรุงการทำงาน | ดีเยี่ยม (5 คะแนน) สามารถประยุกต์ใช้ความรู้ในการทำงานได้อย่างโดดเด่น ผลงานมีคุณภาพสูง มีแนวทางในการปรับปรุงงานที่โดดเด่น ตอบสนองความต้องการขององค์กรได้อย่างมีประสิทธิภาพ', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ไม่สามารถประยุกต์ใช้ความรู้ในการทำงาน และ เสนอแนวคิดในการพัฒนางาน', ''), 1, 4);
  -- Section: ด้านทักษะ (Skills)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULLIF('', ''), 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ทักษะในการทำงานด้านโลจิสติกส์ | ดีเยี่ยม (5 คะแนน) สามารถทำงานได้อย่างมีประสิทธิภาพและเป็นระบบ ทำเสร็จในเวลาที่กำหนดเสมอ', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ไม่สามารถทำงานได้สำเร็จ งานมีความผิดพลาดและไม่แล้วเสร็จตามกำหนดเวลา', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ทักษะการใช้เทคโนโลยีดิจิทัล โปรแกรมสำนักงานระดับสูง และโปรแกรมประยุกต์ทางโลจิสติกส์เพื่อสืบค้น รวบรวมข้อมูล ตลอดจนวิเคราะห์ข้อมูล | ดีเยี่ยม (5 คะแนน) มีทักษะในการใช้เทคโนโลยีดิจิทัลในการทำงานได้อย่างเชี่ยวชาญ สืบค้น/วิเคราะห์ข้อมูลได้อย่างรวดเร็ว ผลงานมีคุณภาพสูง', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ทักษะการใช้เทคโนโลยีดิจิทัลในการทำงานไม่เพียงพอ ผลงานที่ทำไม่ถูกต้องครบถ้วน ไม่ตอบสนองความต้องการขององค์กร', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ทักษะการสื่อสารในการทำงาน | ดีเยี่ยม (5 คะแนน) สามารถสื่อสารและนำเสนอได้ชัดเจน เข้าใจได้ง่าย ใช้ภาษาและสื่อได้อย่างเหมาะสม  มีการโน้มน้าวใจในการสื่อสาร', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ลักษณะบุคคล/สมรรถนะ | ผลการประเมิน', ''), 1, 4);
  -- Section: ด้านจริยธรรม (Ethics)
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULLIF('', ''), 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ความซื่อสัตย์ และการปฏิบัติตามกฎระเบียบขององค์กร | ดีเยี่ยม (5 คะแนน) มีความซื่อสัตย์ ปฏิบัติตามกฎระเบียบขององค์กรอย่างเคร่งครัด', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ขาดความซื่อสัตย์ ไม่ปฏิบัติตามกฎระเบียบ และส่งผลกระทบต่อการทำงาน', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ความรับผิดชอบต่อตนเองและสังคม | ดีเยี่ยม (5 คะแนน) มีความรับผิดชอบสูง ปฏิบัติหน้าที่ได้ดีเยี่ยม และมีส่วนร่วมในการทำประโยชน์แก่สังคมอย่างดีเยี่ยม', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ขาดความรับผิดชอบ ละเลยหน้าที่ ไม่มีส่วนร่วมในการส่งเสริมสังคม', ''), 1, 4);
  -- Section: ด้านลักษณะบุคคล
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULLIF('', ''), 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ภาวะผู้นำ การเป็นทั้งผู้นำและผู้ตามที่ดี และความสามารถในการทำงานร่วมกับผู้อื่น | ดีเยี่ยม (5 คะแนน) มีภาวะความเป็นผู้นำสูง และเป็นผู้ตามที่ดี ยอมรับคำแนะนำและทำงานร่วมกับผู้อื่นอย่างมีประสิทธิภาพ สนับสนุนการทำงานร่วมกันและสร้างบรรยากาศที่ดีในทีม', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('สามารถเป็นผู้นำในบางสถานการณ์ และเป็นผู้ตามได้เมื่อจำเป็น มีความพยายามในการทำงานร่วมกับผู้อื่น แต่ยังขาดความคล่องแคล่วในการประสานงานหรือการรับผิดชอบในบางครั้ง', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ขาดภาวะผู้นำ ทำงานร่วมกับผู้อื่นไม่ดี มีปัญหาด้านการสื่อสารและการประสานงาน', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ใจอาสา | ดีเยี่ยม (5 คะแนน) มีใจอาสา พร้อมที่จะช่วยเหลือผู้อื่นในทุกสถานการณ์', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ขาดความเต็มใจในการช่วยเหลือผู้อื่น และไม่แสดงถึงความตั้งใจในการมีส่วนร่วมในกิจกรรมที่ต้องการความช่วยเหลือ', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'การใฝ่เรียนรู้ | ดีเยี่ยม (5 คะแนน) มีความกระตือรือร้นในการเรียนรู้ พัฒนาทักษะอย่างต่อเนื่อง และนำความรู้ที่ได้ไปใช้ในทางปฏิบัติอย่างมีประสิทธิภาพ', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ขาดความตั้งใจในการเรียนรู้ ไม่มีความสนใจในการหาความรู้ใหม่ ๆ หรือการพัฒนาทักษะ', ''), 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'การคิดวิเคราะห์อย่างมีเหตุผลเพื่อแก้ไขปัญหาหรือพัฒนางาน | ดีเยี่ยม (5 คะแนน) มีการคิดวิเคราะห์ที่มีเหตุผล สามารถระบุปัญหาหรือจุดที่ต้องการพัฒนาได้อย่างแม่นยำ และเสนอทางแก้ที่เหมาะสม โดยใช้ข้อมูลและหลักฐานที่มีความชัดเจน นำไปสู่การแก้ไขปัญหาหรือพัฒนางานได้อย่างมีประสิทธิภาพ', NULLIF('', ''), NULLIF('', ''), 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดีมาก', NULLIF('Very Good', ''), NULLIF('', ''), 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ดี', NULLIF('Good', ''), NULLIF('', ''), 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'พอใช้', NULLIF('Fair', ''), NULLIF('', ''), 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, 'ควรปรับปรุง', NULLIF('Needs Improvement', ''), NULLIF('ขาดความสามารถในการคิดวิเคราะห์หรือใช้เหตุผลในการแก้ไขปัญหาหรือพัฒนางาน', ''), 1, 4);
END $$;

