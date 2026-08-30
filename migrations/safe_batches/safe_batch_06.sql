DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิทยาศาสตร์', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิทยาศาสตร์.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'อธิบายกฎ ทฤษฎี หลักการ และปรากฏการณ์ต่าง ๆ โดยใช้ความรู้พื้นฐานทางวิทยาศาสตร์และคณิตศาสตร์ ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): อธิบายกฎ ทฤษฎี หลักการ และปรากฏการณ์ต่าง ๆ โดยใช้ความรู้พื้นฐานทางวิทยาศาสตร์และคณิตศาสตร์ได้อย่างครบถ้วนและถูกต้อง   4 (ดีมาก): อธิบายกฎ ทฤษฎี หลักการ และปรากฏการณ์ต่าง ๆ โดยใช้ความรู้พื้นฐานทางวิทยาศาสตร์และคณิตศาสตร์ได้อย่างครบถ้วนและถูกต้องเป็นส่วนใหญ่   3 (ดี): อธิบายกฎ ทฤษฎี หลักการ และปรากฏการณ์ต่าง ๆ โดยใช้ความรู้พื้นฐานทางวิทยาศาสตร์และคณิตศาสตร์ได้ถูกต้องเป็นส่วนใหญ่ แต่ขาดรายละเอียดปลีกย่อย   2 (พอใช้): อธิบายกฎ ทฤษฎี หลักการ และปรากฏการณ์ต่าง ๆ โดยใช้ความรู้พื้นฐานทางวิทยาศาสตร์และคณิตศาสตร์ได้ แต่ยังมีข้อผิดพลาดที่ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถอธิบายกฎ ทฤษฎี หลักการ และปรากฏการณ์ต่าง ๆ โดยใช้ความรู้พื้นฐานทางวิทยาศาสตร์และคณิตศาสตร์ได้', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ประยุกต์ใช้ความรู้เฉพาะด้านของแต่ละวิชาเอก (วิชาเอกคณิตศาสตร์และสถิติ หรือวิชาเอกเคมี หรือวิชาเอกชีววิทยา หรือวิชาเอกฟิสิกส์) เพื่อการแก้ปัญหาทางวิทยาศาสตร์ ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): ประยุกต์ใช้ความรู้เฉพาะด้านของแต่ละวิชาเอก (วิชาเอกคณิตศาสตร์และสถิติ หรือวิชาเอกเคมี หรือวิชาเอกชีววิทยา หรือวิชาเอกฟิสิกส์) เพื่อการแก้ปัญหาทางวิทยาศาสตร์ ได้อย่างถูกต้อง เหมาะสม และนำไปใช้ประโยชน์ได้จริง   4 (ดีมาก): ประยุกต์ใช้ความรู้เฉพาะด้านของแต่ละวิชาเอก (วิชาเอกคณิตศาสตร์และสถิติ หรือวิชาเอกเคมี หรือวิชาเอกชีววิทยา หรือวิชาเอกฟิสิกส์) เพื่อการแก้ปัญหาทางวิทยาศาสตร์ได้อย่างถูกต้องและนำไปใช้ประโยชน์ได้จริง   3 (ดี): ประยุกต์ใช้ความรู้เฉพาะด้านของแต่ละวิชาเอก (วิชาเอกคณิตศาสตร์และสถิติ หรือวิชาเอกเคมี หรือวิชาเอกชีววิทยา หรือวิชาเอกฟิสิกส์) เพื่อการแก้ปัญหาทางวิทยาศาสตร์ได้ถูกต้องเป็นส่วนใหญ่   2 (พอใช้): ประยุกต์ใช้ความรู้เฉพาะด้านของแต่ละวิชาเอก (วิชาเอกคณิตศาสตร์และสถิติ หรือวิชาเอกเคมี หรือวิชาเอกชีววิทยา หรือวิชาเอกฟิสิกส์) เพื่อการแก้ปัญหาทางวิทยาศาสตร์ ได้แต่ยังมีข้อผิดพลาดที่ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถประยุกต์ใช้ความรู้เฉพาะด้านของแต่ละวิชาเอก (วิชาเอกคณิตศาสตร์และสถิติ หรือวิชาเอกเคมี หรือวิชาเอกชีววิทยา หรือวิชาเอกฟิสิกส์) เพื่อการแก้ปัญหาทางวิทยาศาสตร์ได้ (2)', NULL, 'LO2', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ใช้เครื่องมือพื้นฐานเพื่อการทดลองและแก้ปัญหาทางวิทยาศาสตร์ ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): ใช้เครื่องมือพื้นฐานเพื่อการทดลองและแก้ปัญหาทางวิทยาศาสตร์ได้อย่างถูกต้อง และเหมาะสมกับงาน   4 (ดีมาก): ใช้เครื่องมือพื้นฐานเพื่อการทดลองและแก้ปัญหาทางวิทยาศาสตร์ ได้อย่างถูกต้องและเหมาะสมกับงานเป็นส่วนใหญ่   3 (ดี): ใช้เครื่องมือพื้นฐานเพื่อการทดลองและแก้ปัญหาทางวิทยาศาสตร์ได้ถูกต้องเป็นส่วนใหญ่   2 (พอใช้): ใช้เครื่องมือพื้นฐานเพื่อการทดลองและแก้ปัญหาทางวิทยาศาสตร์ได้แต่ยังมีข้อผิดพลาดที่ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถใช้เครื่องมือพื้นฐานเพื่อการทดลองและแก้ปัญหาทางวิทยาศาสตร์ได้', NULL, 'LO3', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'เลือกใช้เครื่องมือเพื่อการวิเคราะห์และทดสอบทางวิทยาศาสตร์ตามสาขาวิชาเอก ดังนี้ คณิตศาสตร์และสถิติ (สำหรับวิชาเอกคณิตศาสตร์และสถิติ) หรือเคมี (สำหรับวิชาเอกเคมี) หรือชีววิทยา (สำหรับวิชาเอกชีววิทยา) หรือฟิสิกส์ (สำหรับวิชาเอกฟิสิกส์) ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): เลือกใช้เครื่องมือเพื่อการวิเคราะห์และทดสอบทางวิทยาศาสตร์ตามสาขาวิชาเอกได้อย่างถูกต้อง เหมาะสม และนำไปใช้ประโยชน์ได้จริง   4 (ดีมาก): เลือกใช้เครื่องมือเพื่อการวิเคราะห์และทดสอบทางวิทยาศาสตร์ตามสาขาวิชาเอกได้อย่างถูกต้องและนำไปใช้ประโยชน์ได้จริง   3 (ดี): เลือกใช้เครื่องมือเพื่อการวิเคราะห์และทดสอบทางวิทยาศาสตร์ตามสาขาวิชาเอกได้ถูกต้องเป็นส่วนใหญ่   2 (พอใช้): เลือกใช้เครื่องมือเพื่อการวิเคราะห์และทดสอบทางวิทยาศาสตร์ตามสาขาวิชาเอกได้แต่ยังมีข้อผิดพลาดที่ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถเลือกใช้เครื่องมือเพื่อการวิเคราะห์และทดสอบทางวิทยาศาสตร์ตามสาขาวิชาเอกได้', NULL, 'LO4', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะในการทำวิจัย เพื่อแก้ปัญหาทางวิทยาศาสตร์ ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): มีทักษะในการทำวิจัย เพื่อแก้ปัญหาทางวิทยาศาสตร์ได้อย่างถูกต้อง เหมาะสม และใช้ได้จริงในสถานประกอบการ   4 (ดีมาก): มีทักษะในการทำวิจัย เพื่อแก้ปัญหาทางวิทยาศาสตร์ได้อย่างถูกต้อง   3 (ดี): มีทักษะในการทำวิจัย เพื่อแก้ปัญหาทางวิทยาศาสตร์ได้ถูกต้องเป็นส่วนใหญ่   2 (พอใช้): มีทักษะในการทำวิจัย เพื่อแก้ปัญหาทางวิทยาศาสตร์ได้แต่ยังมีข้อผิดพลาดที่ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่มีทักษะในการทำวิจัย เพื่อแก้ปัญหาทางวิทยาศาสตร์ได้', NULL, 'LO5', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'มีทักษะการสื่อสารภาษาไทยหรือภาษาต่างประเทศ ในการสื่อสารวิทยาศาสตร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานตามวัตถุประสงค์ ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): มีทักษะการสื่อสารภาษาไทยหรือภาษาต่างประเทศ ในการสื่อสารวิทยาศาสตร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานตามวัตถุประสงค์ได้อย่างถูกต้อง เหมาะสม และใช้ได้จริงในสถานประกอบการ   4 (ดีมาก): มีทักษะการสื่อสารภาษาไทยหรือภาษาต่างประเทศ ในการสื่อสารวิทยาศาสตร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานตามวัตถุประสงค์ได้อย่างถูกต้อง   3 (ดี): มีทักษะการสื่อสารภาษาไทยหรือภาษาต่างประเทศ ในการสื่อสารวิทยาศาสตร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานตามวัตถุประสงค์ได้ถูกต้องเป็นส่วนใหญ่   2 (พอใช้): มีทักษะการสื่อสารภาษาไทยหรือภาษาต่างประเทศ ในการสื่อสารวิทยาศาสตร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานตามวัตถุประสงค์ได้แต่ยังมีข้อผิดพลาดที่ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่มีทักษะการสื่อสารภาษาไทยหรือภาษาต่างประเทศ ในการสื่อสารวิทยาศาสตร์ ทั้งการฟัง พูด อ่าน เขียน และนำเสนอผลงานตามวัตถุประสงค์ได้', NULL, 'LO6', 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ใช้เทคโนโลยีสารสนเทศในการค้นคว้า แสวงหาความรู้ และประยุกต์ในงานด้านวิทยาศาสตร์และงานสำนักงานได้อย่างรู้เท่าทัน ท่ามกลางการเปลี่ยนแปลงในยุคดิจิทัล ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): ใช้เทคโนโลยีสารสนเทศในการค้นคว้า แสวงหาความรู้ และประยุกต์ในงานด้านวิทยาศาสตร์และงานสำนักงานได้อย่างรู้เท่าทัน ท่ามกลางการเปลี่ยนแปลงในยุคดิจิทัลได้อย่างถูกต้อง และเหมาะสม   4 (ดีมาก): ใช้เทคโนโลยีสารสนเทศในการค้นคว้า แสวงหาความรู้ และประยุกต์ในงานด้านวิทยาศาสตร์และงานสำนักงานได้อย่างรู้เท่าทัน ท่ามกลางการเปลี่ยนแปลงในยุคดิจิทัลได้อย่างถูกต้อง   3 (ดี): ใช้เทคโนโลยีสารสนเทศในการค้นคว้า แสวงหาความรู้ และประยุกต์ในงานด้านวิทยาศาสตร์และงานสำนักงานได้อย่างรู้เท่าทัน ท่ามกลางการเปลี่ยนแปลงในยุคดิจิทัลได้ถูกต้องเป็นส่วนใหญ่   2 (พอใช้): ใช้เทคโนโลยีสารสนเทศในการค้นคว้า แสวงหาความรู้ และประยุกต์ในงานด้านวิทยาศาสตร์และงานสำนักงานได้อย่างรู้เท่าทัน ท่ามกลางการเปลี่ยนแปลงในยุคดิจิทัลได้แต่ยังมีข้อผิดพลาดที่ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถใช้เทคโนโลยีสารสนเทศในการค้นคว้า แสวงหาความรู้ และประยุกต์ในงานด้านวิทยาศาสตร์และงานสำนักงานได้อย่างรู้เท่าทัน ท่ามกลางการเปลี่ยนแปลงในยุคดิจิทัลได้ (3)', NULL, 'LO7', 'single_choice'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ปฏิบัติตามจริยธรรมขั้นพื้นฐาน 4 ด้าน ได้แก่ มีความรับผิดชอบ มีความซื่อสัตย์ เคารพกฎเกณฑ์ในสังคม และมีความกตัญญูรู้คุณ ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): ปฏิบัติตามจริยธรรมขั้นพื้นฐาน ครบทั้ง 4 ด้าน   4 (ดีมาก): ปฏิบัติตามจริยธรรมขั้นพื้นฐาน 3 ใน 4 ด้าน   3 (ดี): ปฏิบัติตามจริยธรรมขั้นพื้นฐาน 2 ใน 4 ด้าน   2 (พอใช้): ปฏิบัติตามจริยธรรมขั้นพื้นฐาน 1 ใน 4 ด้าน   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามจริยธรรมขั้นพื้นฐานทั้ง 4 ด้าน', NULL, 'LO8', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ปฏิบัติตามจรรยาบรรณด้านความประพฤติต่อผู้ร่วมงานและผู้อื่นของวิชาชีพทางวิทยาศาสตร์และเทคโนโลยี ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): ปฏิบัติตามจรรยาบรรณด้านความประพฤติต่อผู้ร่วมงานและผู้อื่นของวิชาชีพทางวิทยาศาสตร์และเทคโนโลยีได้อย่างเคร่งครัดและมีความสม่ำเสมอ   4 (ดีมาก): ปฏิบัติตามจรรยาบรรณด้านความประพฤติต่อผู้ร่วมงานและผู้อื่นของวิชาชีพทางวิทยาศาสตร์และเทคโนโลยีได้อย่างดี   3 (ดี): ปฏิบัติตามจรรยาบรรณด้านความประพฤติต่อผู้ร่วมงานและผู้อื่นของวิชาชีพทางวิทยาศาสตร์และเทคโนโลยีบางส่วนและไม่กระทบต่อคุณภาพโดยรวม   2 (พอใช้): ปฏิบัติตามจรรยาบรรณด้านความประพฤติต่อผู้ร่วมงานและผู้อื่นของวิชาชีพทางวิทยาศาสตร์และเทคโนโลยีบางส่วนและกระทบต่อคุณภาพโดยรวม   1 (ต้องปรับปรุง): ไม่ปฏิบัติตามจรรยาบรรณด้านความประพฤติต่อผู้ร่วมงานและผู้อื่นของวิชาชีพทางวิทยาศาสตร์และเทคโนโลยี (4)', NULL, 'LO9', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงลักษณะของการเป็นนักวิจัยทางวิทยาศาสตร์ 3 ด้าน ได้แก่ ช่างสังเกต คิดอย่างเป็นระบบ และมีเหตุผล ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): แสดงออกถึงลักษณะของการเป็นนักวิจัยทางวิทยาศาสตร์ครบทั้ง 3 ด้านอย่างโดดเด่น   4 (ดีมาก): แสดงออกถึงลักษณะของการเป็นนักวิจัยทางวิทยาศาสตร์ครบทั้ง 3 ด้าน   3 (ดี): แสดงออกถึงลักษณะของการเป็นนักวิจัยทางวิทยาศาสตร์ 2 ใน 3 ด้าน   2 (พอใช้): แสดงออกถึงลักษณะของการเป็นนักวิจัยทางวิทยาศาสตร์ 1 ใน 3 ด้าน   1 (ต้องปรับปรุง): ไม่แสดงออกถึงลักษณะของการเป็นนักวิจัยทางวิทยาศาสตร์ทั้ง 3 ด้าน', NULL, 'LO10', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'แสดงออกถึงลักษณะบุคคล 6 ด้าน ได้แก่ มีภาวะผู้นำ มีวินัย มีจิตอาสา มีสุขภาวะ มีความสามารถในการปรับตัว และทำงานร่วมกับผู้อื่น ในการปฏิบัติสหกิจศึกษา ที่สถานประกอบการได้ |   5 (ยอดเยี่ยม): แสดงออกถึงลักษณะบุคคลครบทั้ง 6 ด้าน   4 (ดีมาก): แสดงออกถึงลักษณะบุคคล 5 ใน 6 ด้าน   3 (ดี): แสดงออกถึงลักษณะบุคคล 4 ใน 6 ด้าน   2 (พอใช้): แสดงออกถึงลักษณะบุคคล 3 ใน 6 ด้าน   1 (ต้องปรับปรุง): แสดงออกถึงลักษณะบุคคล 2 ใน 6 ด้าน', NULL, 'LO11', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิทยาศาสตร์ทางทะเล', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.97, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'หลักสูตรวิทยาศาสตร์ทางทะเล_CLO_สหกิจศึกษา_JR310.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| อธิบายคุณค่าความเป็นมนุษย์ ความหลากหลายทางวัฒนธรรม ปรับตัว และแก้ปัญหาเฉพาะหน้าในสถานการณ์ที่มีการเปลี่ยนแปลงของสังคม-เศรษฐกิจ และสิ่งแวดล้อม', NULL, 'PLO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| อธิบายองค์ความรู้ด้านวิทยาศาสตร์ คณิตศาสตร์ สถิติ และเทคโนโลยีสารสนเทศ ได้อย่างถูกต้องตามหลักวิชาการ', NULL, 'PLO2', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| อธิบายหลักการ กระบวนการ การใช้เครื่องมือหรือเทคโนโลยีในภาคสนามและห้องปฏิบัติการ เป็นลำดับขั้นตอนที่ถูกต้องตามหลักวิชาการ', NULL, 'PLO3', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| ประยุกต์ใช้ความรู้ทางวิทยาศาสตร์เพื่อแก้ปัญหาด้านสิ่งแวดล้อม และทรัพยากรทางทะเลและชายฝั่งได้ถูกต้องตามหลักวิชาการ', NULL, 'PLO4', 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะการคิดวิเคราะห์และวิพากษ์เพื่อแก้ปัญหาด้านสิ่งแวดล้อม และทรัพยากรทางทะเลและชายฝั่ง', NULL, 'PLO5', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะในการใช้เทคโนโลยีสารสนเทศในการค้นคว้า การจัดเก็บ ประมวลผล และนำเสนอข้อมูลเชิงวิชาการได้อย่างเหมาะสมกับสถานการณ์', NULL, 'PLO6', 'single_choice'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะในการสื่อสารด้วยภาษาไทยและภาษาอังกฤษ เพื่อใช้ในชีวิตประจำวัน และในการทำงานด้านวิทยาศาสตร์ทางทะเล ทั้งการฟัง การพูด การเขียน และนำเสนอผลงานได้ตามวัตถุประสงค์ ในกรณีที่นักศึกษาเลือกภาษาจีนสามารถสื่อสารภาษาจีนในชีวิตประจำวันได้', NULL, 'PLO7', 'single_choice'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะในการใช้อุปกรณ์และเครื่องมือเพื่อเก็บตัวอย่างในภาคสนาม และวิเคราะห์ตัวอย่างในห้องปฏิบัติการที่เกี่ยวข้องกับวิทยาศาสตร์พื้นฐาน และคุณภาพสิ่งแวดล้อมทางทะเลในด้านชีวภาพ กายภาพ และด้านเคมีได้อย่างถูกต้องตามมาตรฐานของห้องปฏิบัติการ', NULL, 'PLO8', 'single_choice'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะในการใช้โปรแกรมประยุกต์ด้านภูมิสารสนเทศ และด้านสถิติเพื่อการจัดการทรัพยากรทางทะเลและชายฝั่ง', NULL, 'PLO9', 'single_choice'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีทักษะการทำงานเป็นทีม ทักษะการเล่นกีฬา และการออกกำลังกายเพื่อการดูแลสุขภาพพื้นฐาน', NULL, 'PLO10', 'single_choice'::question_type, true, 6)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านจริยธรรม (Ethics)', NULL, 'ethics'::domain_type, 3)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| มีจริยธรรมทางวิชาการ มีความซื่อสัตย์ มีความกตัญญู และมีความรับผิดชอบต่อตนเอง ผู้อื่น และสังคม', NULL, 'PLO11', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านลักษณะบุคคล', NULL, 'character'::domain_type, 4)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, '| แสดงออกถึงการมีภาวะผู้นำ ผู้ตาม มีจิตอาสาในการทำงาน มีวินัย ปฏิบัติตามกฏระเบียบและกฏหมาย', NULL, 'PLO12', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
END $$;


DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, 'หลักสูตรวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์', NULL, 'draft', 'draft'::assessment_status, '0.1', sd.id, 1.0, true
  FROM public.assessment_source_documents sd WHERE sd.filename = 'ผลลัพธ์การเรียนรู้ของวิชาสหกิจศึกษา หลักสูตรวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ พ.ศ.67.docx'
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านความรู้ (Knowledge)', NULL, 'knowledge'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์หลักการทางวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ได้อย่างเหมาะสม', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 2)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถรวบรวม วิเคราะห์ และแปลผลข้อมูลจากการปฏิบัติงานในสถานประกอบการ เพื่อหาข้อสรุปที่เป็นประโยชน์', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, 'ผู้เรียนสามารถสื่อสารกับเพื่อนร่วมงานและบุคคลในสถานประกอบการด้วยภาษาไทยและภาษาอังกฤษได้อย่างเหมาะสม เพื่อให้การทำงานสำเร็จลุล่วงตามเป้าหมาย', NULL, 'LO3', 'single_choice'::question_type, true, 2)
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
  VALUES (t_id, s_id, ': ผู้เรียนสามารถระบุและแก้ปัญหาที่ซับซ้อนในงานที่ได้รับมอบหมายในสถานประกอบการ โดยประยุกต์หลักการทางวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ได้อย่างเหมาะสม |   5 (ยอดเยี่ยม): ระบุและแก้ปัญหาที่ซับซ้อนได้อย่างครบถ้วน พร้อมเสนอแนวทางแก้ไขที่สร้างสรรค์ มีประสิทธิภาพสูง และตอบโจทย์ความต้องการของสถานประกอบการได้อย่างสมบูรณ์   4 (ดีมาก): ระบุและแก้ปัญหาได้ในระดับดี พร้อมเสนอแนวทางแก้ไขที่เหมาะสม แม้จะมีข้อบกพร่องเล็กน้อยแต่ไม่กระทบต่อคุณภาพโดยรวม   3 (ดี): ระบุปัญหาและแก้ไขได้ในระดับพื้นฐาน แต่ข้อเสนอแนวทางแก้ไขยังขาดความสมบูรณ์ในบางส่วน   2 (พอใช้): ระบุปัญหาได้บางส่วน แต่ไม่สามารถแก้ไขได้อย่างเหมาะสม ต้องการคำแนะนำอย่างใกล้ชิด   1 (ต้องปรับปรุง): ไม่สามารถระบุหรือแก้ปัญหาได้ และไม่มีข้อเสนอแนะแนวทางแก้ไข (2)', NULL, 'LO1', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'ด้านทักษะ (Skills)', NULL, 'skills'::domain_type, 6)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถรวบรวม วิเคราะห์ และแปลผลข้อมูลจากการปฏิบัติงานในสถานประกอบการได้ |   5 (ยอดเยี่ยม): วิเคราะห์ข้อมูลได้อย่างถูกต้อง ครบถ้วน และแปลผลได้ชัดเจน พร้อมข้อสรุปที่นำไปใช้ได้จริง   4 (ดีมาก): วิเคราะห์ข้อมูลได้ดีในระดับที่เหมาะสม พร้อมข้อสรุปที่เป็นประโยชน์ แม้จะมีข้อผิดพลาดเล็กน้อย   3 (ดี): วิเคราะห์ข้อมูลได้ในระดับพื้นฐาน แต่ข้อสรุปยังขาดความชัดเจนและสมบูรณ์ในบางส่วน   2 (พอใช้): วิเคราะห์ข้อมูลได้เพียงบางส่วน และข้อสรุปยังไม่ชัดเจน ต้องการคำแนะนำเพิ่มเติม   1 (ต้องปรับปรุง): ไม่สามารถวิเคราะห์ข้อมูลหรือแปลผลได้', NULL, 'LO2', 'single_choice'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, ': ผู้เรียนสามารถสื่อสารกับเพื่อนร่วมงานและบุคคลในสถานประกอบการด้วยภาษาไทยและภาษาอังกฤษได้ |   5 (ยอดเยี่ยม): สื่อสารได้ชัดเจน เข้าใจง่าย ใช้ภาษาไทยและภาษาอังกฤษได้อย่างเหมาะสมกับสถานการณ์   4 (ดีมาก): สื่อสารได้ดีในระดับที่เหมาะสม แม้จะมีข้อผิดพลาดเล็กน้อยที่ไม่กระทบต่อการทำงาน   3 (ดี): สื่อสารได้ในระดับพื้นฐาน แต่ยังมีข้อผิดพลาดหรือจุดที่ไม่ชัดเจนในบางสถานการณ์   2 (พอใช้): สื่อสารได้บ้าง แต่ยังไม่เหมาะสมกับสถานการณ์หรือมีข้อผิดพลาดที่ส่งผลต่อการทำงาน   1 (ต้องปรับปรุง): ไม่สามารถสื่อสารได้อย่างเหมาะสมในสถานการณ์จริง', NULL, 'LO3', 'single_choice'::question_type, true, 2)
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

