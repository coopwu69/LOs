DO $$ DECLARE t_id uuid; s_id uuid; q_id uuid; BEGIN
  INSERT INTO public.evaluation_templates (program_id, name, title_en, status, status_enum, version_label, source_document_id, extraction_confidence, needs_review)
  SELECT sd.program_id, convert_from(decode('e0b8abe0b8a5e0b8b1e0b881e0b8aae0b8b9e0b895e0b8a3e0b8a3e0b8b1e0b890e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b89ae0b8b1e0b893e0b891e0b8b4e0b89520e0b8aae0b8b2e0b882e0b8b2e0b884e0b8a7e0b8b2e0b8a1e0b8aae0b8b1e0b8a1e0b89ee0b8b1e0b899e0b898e0b98ce0b8a3e0b8b0e0b8abe0b8a7e0b988e0b8b2e0b887e0b89be0b8a3e0b8b0e0b980e0b897e0b8a8', 'hex'), 'utf8'), convert_from(decode('33203d20e0b894e0b8b52028476f6f6429', 'hex'), 'utf8'), 'draft', 'draft'::assessment_status, '0.1', sd.id, 0.78, true
  FROM public.assessment_source_documents sd WHERE sd.filename = convert_from(decode('4c4f20e0b981e0b8a5e0b8b0e0b981e0b89ae0b89ae0b8aae0b8ade0b89ae0b896e0b8b2e0b8a1202d20e0b8abe0b8a5e0b8b1e0b881e0b8aae0b8b9e0b895e0b8a3e0b8a3e0b8b1e0b890e0b8a8e0b8b2e0b8aae0b895e0b8a3e0b98c20495220323536372e646f6378', 'hex'), 'utf8')
  RETURNING id INTO t_id;
  IF t_id IS NULL THEN RETURN; END IF;
  INSERT INTO public.assessment_sections (template_id, title_th, title_en, domain_type, sequence)
  VALUES (t_id, 'Section 1', NULL, 'general'::domain_type, 1)
  RETURNING id INTO s_id;
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3120e0b983e0b88ae0b989e0b884e0b8a7e0b8b2e0b8a1e0b8a3e0b8b9e0b989e0b89ee0b8b7e0b989e0b899e0b890e0b8b2e0b8992fe0b981e0b899e0b8a7e0b884e0b8b4e0b894e0b894e0b989e0b8b2e0b899e0b884e0b8a7e0b8b2e0b8a1e0b8aae0b8b1e0b8a1e0b89ee0b8b1e0b899e0b898e0b98ce0b8a3e0b8b0e0b8abe0b8a7e0b988e0b8b2e0b887e0b89be0b8a3e0b8b0e0b980e0b897e0b8a8e0b983e0b899e0b881e0b8b2e0b8a3e0b89ee0b8b1e0b892e0b899e0b8b2e0b8abe0b8a3e0b8b7e0b8', 'hex'), 'utf8') || convert_from(decode('ade0b981e0b881e0b989e0b984e0b882e0b89be0b8b1e0b88de0b8abe0b8b2e0b983e0b899e0b8aae0b896e0b8b2e0b899e0b89be0b8a3e0b8b0e0b881e0b8ade0b89ae0b881e0b8b2e0b8a3e0b984e0b894e0b98920284170706c6965732066756e64616d656e74616c204952206b6e6f776c65646765206f7220636f6e636570747320746f20696d70726f7665206f7220736f6c7665206f7267616e697a6174696f6e616c20776f726b2070726f636573736573206566666563746976656c792e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 1)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3220e0b983e0b88ae0b989e0b881e0b8a3e0b8b0e0b89ae0b8a7e0b899e0b881e0b8b2e0b8a3e0b884e0b8b4e0b894e0b8a7e0b8b4e0b980e0b884e0b8a3e0b8b2e0b8b0e0b8abe0b98ce0b981e0b8a5e0b8b0e0b884e0b8a7e0b8b2e0b8a1e0b884e0b8b4e0b894e0b8aae0b8a3e0b989e0b8b2e0b887e0b8aae0b8a3e0b8a3e0b884e0b98c20e0b980e0b89ee0b8b7e0b988e0b8ade0b8a3e0b8b0e0b89ae0b8b8e0b981e0b8a5e0b8b0e0b8a7e0b8b4e0b980e0b884e0b8a3e0b8b2e0b8b0e0b8abe0b98ce0b8', 'hex'), 'utf8') || convert_from(decode('9be0b8b1e0b88de0b8abe0b8b220e0b89ee0b8a3e0b989e0b8ade0b8a1e0b980e0b8aae0b899e0b8ade0b981e0b899e0b8a7e0b897e0b8b2e0b887e0b981e0b881e0b989e0b984e0b882e0b8ade0b8a2e0b988e0b8b2e0b887e0b980e0b89be0b987e0b899e0b8a3e0b8b0e0b89ae0b89a2028456d706c6f797320616e616c79746963616c20616e64206372656174697665207468696e6b696e6720746f206964656e7469667920616e6420616e616c797a652070726f626c656d7320616e642070726f706f7365', 'hex'), 'utf8') || convert_from(decode('2073797374656d6174696320736f6c7574696f6e732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 2)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3320e0b897e0b8b1e0b899e0b895e0b988e0b8ade0b980e0b8abe0b895e0b8b8e0b881e0b8b2e0b8a3e0b893e0b98c2fe0b882e0b988e0b8b2e0b8a7e0b8aae0b8b2e0b8a3e0b897e0b8b5e0b988e0b980e0b881e0b8b5e0b988e0b8a2e0b8a7e0b882e0b989e0b8ade0b887e0b881e0b8b1e0b89ae0b8a7e0b8b4e0b88ae0b8b2e0b88ae0b8b5e0b89ee0b981e0b8a5e0b8b0e0b8aae0b896e0b8b2e0b899e0b881e0b8b2e0b8a3e0b893e0b98ce0b89be0b8b1e0b888e0b888e0b8b8e0b89ae0b8b1e0b89920e0', 'hex'), 'utf8') || convert_from(decode('b8a1e0b8b5e0b884e0b8a7e0b8b2e0b8a1e0b8aae0b8b2e0b8a1e0b8b2e0b8a3e0b896e0b983e0b899e0b881e0b8b2e0b8a3e0b8aae0b8b7e0b89ae0b884e0b989e0b899e0b882e0b989e0b8ade0b8a1e0b8b9e0b8a5e0b980e0b88ae0b8b4e0b887e0b8a7e0b8b4e0b88ae0b8b2e0b881e0b8b2e0b8a320284b656570732075702d746f2d646174652077697468206e65777320616e6420696e666f726d6174696f6e2072656c6576616e7420746f207468652070726f66657373696f6e20616e64206375727265', 'hex'), 'utf8') || convert_from(decode('6e7420616666616972732c20616e642064656d6f6e7374726174657320746865206162696c69747920746f20726573656172636820666f722061636164656d6963207265736f75726365732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 3)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3420e0b8aae0b8a3e0b8b8e0b89be0b89ce0b8a5e0b881e0b8b2e0b8a3e0b89be0b88fe0b8b4e0b89ae0b8b1e0b895e0b8b4e0b887e0b8b2e0b899e0b8aae0b8abe0b881e0b8b4e0b888e0b8a8e0b8b6e0b881e0b8a9e0b8b220e0b981e0b8a5e0b8b0e0b899e0b8b3e0b980e0b8aae0b899e0b8ade0b89ce0b8a5e0b887e0b8b2e0b899e0b984e0b894e0b989e0b895e0b8b2e0b8a1e0b8a1e0b8b2e0b895e0b8a3e0b890e0b8b2e0b899e0b897e0b8b2e0b887e0b8a7e0b8b4e0b88ae0b8b2e0b881e0b8b2e0b8', 'hex'), 'utf8') || convert_from(decode('a320e0b89ee0b8a3e0b989e0b8ade0b8a1e0b980e0b88ae0b8b7e0b988e0b8ade0b8a1e0b982e0b8a2e0b887e0b89be0b8a3e0b8b0e0b8aae0b89ae0b881e0b8b2e0b8a3e0b893e0b98ce0b8aae0b8b9e0b988e0b881e0b8b2e0b8a3e0b8a7e0b8b2e0b887e0b981e0b89ce0b899e0b89be0b8a3e0b8b0e0b881e0b8ade0b89ae0b8ade0b8b2e0b88ae0b8b5e0b89e2fe0b881e0b8b2e0b8a3e0b89ee0b8b1e0b892e0b899e0b8b2e0b895e0b988e0b8ade0b8a2e0b8ade0b894202853756d6d6172697a65732063', 'hex'), 'utf8') || convert_from(decode('6f2d6f7020776f726b20726573756c747320616e642070726573656e7473207468656d206163636f7264696e6720746f2061636164656d6963207374616e64617264732c206c696e6b696e6720657870657269656e63657320746f206675747572652063617265657220706c616e6e696e67206f72206675727468657220646576656c6f706d656e742e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 4)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3120e0b895e0b8b4e0b894e0b895e0b988e0b8ade0b8aae0b8b7e0b988e0b8ade0b8aae0b8b2e0b8a32028e0b89fe0b8b1e0b88720e0b89ee0b8b9e0b89420e0b8ade0b988e0b8b2e0b89920e0b980e0b882e0b8b5e0b8a2e0b8992920e0b897e0b8b1e0b989e0b887e0b8a0e0b8b2e0b8a9e0b8b2e0b984e0b897e0b8a220e0b8a0e0b8b2e0b8a9e0b8b2e0b8ade0b8b1e0b887e0b881e0b8a4e0b8a920e0b981e0b8a5e0b8b02fe0b8abe0b8a3e0b8b7e0b8ade0b8a0e0b8b2e0b8a9e0b8b2e0b897e0b8b5e0b9', 'hex'), 'utf8') || convert_from(decode('88e0b8aae0b8b2e0b8a1e0b984e0b894e0b989e0b8ade0b8a2e0b988e0b8b2e0b887e0b980e0b8abe0b8a1e0b8b2e0b8b0e0b8aae0b8a120e0b982e0b894e0b8a2e0b884e0b8b3e0b899e0b8b6e0b887e0b896e0b8b6e0b887e0b884e0b8a7e0b8b2e0b8a1e0b981e0b895e0b881e0b895e0b988e0b8b2e0b887e0b897e0b8b2e0b887e0b8a7e0b8b1e0b892e0b899e0b898e0b8a3e0b8a3e0b8a12028436f6d6d756e696361746573206566666563746976656c7920286c697374656e696e672c20737065616b69', 'hex'), 'utf8') || convert_from(decode('6e672c2072656164696e672c2077726974696e672920696e20546861692c20456e676c6973682c20616e642f6f722061207468697264206c616e67756167652c20636f6e7369646572696e672063756c747572616c20646966666572656e6365732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 5)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3220e0b983e0b88ae0b989e0b980e0b897e0b884e0b982e0b899e0b982e0b8a5e0b8a2e0b8b5e0b8aae0b8b2e0b8a3e0b8aae0b899e0b980e0b897e0b8a8e0b983e0b899e0b881e0b8b2e0b8a3e0b8aae0b8b7e0b89ae0b884e0b989e0b89920e0b888e0b8b1e0b894e0b980e0b881e0b987e0b89a20e0b8a7e0b8b4e0b980e0b884e0b8a3e0b8b2e0b8b0e0b8abe0b98ce0b882e0b989e0b8ade0b8a1e0b8b9e0b8a520e0b888e0b8b1e0b894e0b897e0b8b3e0b8a3e0b8b2e0b8a2e0b887e0b8b2e0b899e0b984', 'hex'), 'utf8') || convert_from(decode('e0b894e0b989e0b8ade0b8a2e0b988e0b8b2e0b887e0b896e0b8b9e0b881e0b895e0b989e0b8ade0b88720e0b89ee0b8a3e0b989e0b8ade0b8a1e0b895e0b8a3e0b8b0e0b8abe0b899e0b8b1e0b881e0b896e0b8b6e0b887e0b884e0b8a7e0b8b2e0b8a1e0b89be0b8a5e0b8ade0b894e0b8a0e0b8b1e0b8a2e0b984e0b88be0b980e0b89ae0b8ade0b8a3e0b98c20285574696c697a657320495420736b696c6c7320746f207365617263682c2073746f72652c20616e6420616e616c797a6520646174612c2070', 'hex'), 'utf8') || convert_from(decode('7265706172696e67206163637572617465207265706f727473207768696c6520656e737572696e6720637962657273656375726974792061776172656e6573732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 6)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3320e0b8a7e0b8b2e0b887e0b981e0b89ce0b899e0b981e0b8a5e0b8b0e0b89be0b88fe0b8b4e0b89ae0b8b1e0b895e0b8b4e0b887e0b8b2e0b899e0b983e0b899e0b982e0b884e0b8a3e0b887e0b881e0b8b2e0b8a3e0b8abe0b8a3e0b8b7e0b8ade0b8abe0b899e0b989e0b8b2e0b897e0b8b5e0b988e0b897e0b8b5e0b988e0b984e0b894e0b989e0b8a3e0b8b1e0b89ae0b8a1e0b8ade0b89ae0b8abe0b8a1e0b8b2e0b8a2e0b984e0b894e0b989e0b8ade0b8a2e0b988e0b8b2e0b887e0b895e0b988e0b8ad', 'hex'), 'utf8') || convert_from(decode('e0b980e0b899e0b8b7e0b988e0b8ade0b88720e0b8a1e0b8b5e0b884e0b8a7e0b8b2e0b8a1e0b8aae0b8b2e0b8a1e0b8b2e0b8a3e0b896e0b983e0b899e0b881e0b8b2e0b8a3e0b888e0b8b1e0b894e0b881e0b8b2e0b8a3e0b89be0b8b1e0b88de0b8abe0b8b22fe0b8ade0b8b8e0b89be0b8aae0b8a3e0b8a3e0b884e0b984e0b894e0b989e0b8ade0b8a2e0b988e0b8b2e0b887e0b980e0b8abe0b8a1e0b8b2e0b8b0e0b8aae0b8a1e0b981e0b8a5e0b8b0e0b89be0b8a3e0b8b1e0b89ae0b895e0b8b1e0b8a7', 'hex'), 'utf8') || convert_from(decode('e0b984e0b894e0b989e0b894e0b8b52028506c616e7320616e642063617272696573206f75742061737369676e65642070726f6a65637473206f72207461736b7320636f6e74696e756f75736c792c206566666563746976656c79207265736f6c766573206973737565732c20616e64206164617074732077656c6c20746f206368616e6765732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 7)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3120e0b8a3e0b8b1e0b89ae0b89ce0b8b4e0b894e0b88ae0b8ade0b89ae0b895e0b988e0b8ade0b8abe0b899e0b989e0b8b2e0b897e0b8b5e0b98820e0b8a1e0b8b5e0b884e0b8a7e0b8b2e0b8a1e0b88be0b8b7e0b988e0b8ade0b8aae0b8b1e0b895e0b8a2e0b98ce0b8aae0b8b8e0b888e0b8a3e0b8b4e0b89520e0b981e0b8a5e0b8b0e0b980e0b884e0b8b2e0b8a3e0b89ee0b881e0b88ee0b8a3e0b8b0e0b980e0b89ae0b8b5e0b8a2e0b89ae0b882e0b8ade0b887e0b8ade0b887e0b884e0b98ce0b881e0', 'hex'), 'utf8') || convert_from(decode('b8a3202844656d6f6e7374726174657320726573706f6e736962696c6974792c20686f6e657374792c20616e64207265737065637473206f7267616e697a6174696f6e616c2072756c65732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 8)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3220e0b89be0b88fe0b8b4e0b89ae0b8b1e0b895e0b8b4e0b887e0b8b2e0b899e0b982e0b894e0b8a2e0b8a2e0b8b6e0b894e0b888e0b8a3e0b8a3e0b8a2e0b8b2e0b89ae0b8a3e0b8a3e0b893e0b897e0b8b2e0b887e0b8a7e0b8b4e0b88ae0b8b2e0b88ae0b8b5e0b89e20284164686572657320746f207468652070726f66657373696f6e616c20636f6465206f662065746869637320696e20616c6c207461736b732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 9)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3320e0b8a1e0b8b5e0b8a7e0b8b4e0b899e0b8b1e0b8a220e0b895e0b8a3e0b887e0b895e0b988e0b8ade0b980e0b8a7e0b8a5e0b8b220e0b981e0b8a5e0b8b0e0b895e0b8a3e0b8b0e0b8abe0b899e0b8b1e0b881e0b983e0b899e0b89ae0b897e0b89ae0b8b2e0b897e0b8abe0b899e0b989e0b8b2e0b897e0b8b5e0b988e0b882e0b8ade0b887e0b895e0b89920284d61696e7461696e73206469736369706c696e652c2070756e637475616c6974792c20616e642061776172656e657373206f66206f6e65e2', 'hex'), 'utf8') || convert_from(decode('80997320726573706f6e736962696c69746965732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 10)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3420e0b980e0b884e0b8b2e0b8a3e0b89ee0b8aae0b8b4e0b897e0b898e0b8b4e0b981e0b8a5e0b8b0e0b884e0b8a7e0b8b2e0b8a1e0b884e0b8b4e0b894e0b980e0b8abe0b987e0b899e0b897e0b8b5e0b988e0b8abe0b8a5e0b8b2e0b881e0b8abe0b8a5e0b8b2e0b8a220285265737065637473206f7468657273e280992072696768747320616e642064697665727365206f70696e696f6e73207769746820616e206f70656e206d696e642e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 11)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3120e0b897e0b8b3e0b887e0b8b2e0b899e0b8a3e0b988e0b8a7e0b8a1e0b881e0b8b1e0b89ae0b89ce0b8b9e0b989e0b8ade0b8b7e0b988e0b899e0b984e0b894e0b989e0b8ade0b8a2e0b988e0b8b2e0b887e0b8a1e0b8b5e0b89be0b8a3e0b8b0e0b8aae0b8b4e0b897e0b898e0b8b4e0b8a0e0b8b2e0b89e20e0b8a3e0b988e0b8a7e0b8a1e0b8a1e0b8b7e0b8ade0b881e0b8b1e0b89ae0b897e0b8b5e0b8a120e0b8a1e0b8b5e0b8a7e0b8b4e0b899e0b8b1e0b8a220e0b981e0b8a5e0b8b0e0b981e0b8aa', 'hex'), 'utf8') || convert_from(decode('e0b894e0b887e0b897e0b8b1e0b8a8e0b899e0b884e0b895e0b8b4e0b980e0b89be0b8b4e0b894e0b881e0b8a7e0b989e0b8b2e0b887e0b981e0b89ae0b89ae0b89ee0b8a5e0b980e0b8a1e0b8b7e0b8ade0b887e0b982e0b8a5e0b8812028576f726b73206566666563746976656c7920696e2061207465616d2c206d61696e7461696e73206469736369706c696e652c20616e642073686f7773206120676c6f62616c20636974697a656e2061747469747564652e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 12)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3220e0b981e0b8aae0b894e0b887e0b8ade0b8ade0b881e0b896e0b8b6e0b887e0b888e0b8b4e0b895e0b8ade0b8b2e0b8aae0b8b2e0b983e0b899e0b881e0b8b2e0b8a3e0b88ae0b988e0b8a7e0b8a2e0b980e0b8abe0b8a5e0b8b7e0b8ade0b8aae0b8b1e0b887e0b884e0b8a120e0b981e0b8a5e0b8b0e0b983e0b8abe0b989e0b884e0b8a7e0b8b2e0b8a1e0b8a3e0b988e0b8a7e0b8a1e0b8a1e0b8b7e0b8ade0b881e0b8b1e0b89ae0b881e0b8b4e0b888e0b881e0b8a3e0b8a3e0b8a1e0b8aae0b988e0b8', 'hex'), 'utf8') || convert_from(decode('a7e0b899e0b8a3e0b8a7e0b8a1202844656d6f6e7374726174657320766f6c756e74656572207370697269742c206163746976656c7920636f6e747269627574696e6720746f2074686520636f6d6d756e69747920616e642067726f757020616374697669746965732e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 13)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3320e0b8a1e0b8b5e0b884e0b8a7e0b8b2e0b8a1e0b8ade0b894e0b897e0b89920e0b8a2e0b8b7e0b894e0b8abe0b8a2e0b8b8e0b988e0b89920e0b89ae0b8a3e0b8b4e0b8abe0b8b2e0b8a3e0b980e0b8a7e0b8a5e0b8b2e0b984e0b894e0b989e0b894e0b8b520e0b981e0b8a5e0b8b0e0b8aae0b8b2e0b8a1e0b8b2e0b8a3e0b896e0b897e0b8b3e0b887e0b8b2e0b899e0b8a0e0b8b2e0b8a2e0b983e0b895e0b989e0b8aae0b8a0e0b8b2e0b8a7e0b8b0e0b881e0b894e0b894e0b8b1e0b899202853686f77', 'hex'), 'utf8') || convert_from(decode('7320726573696c69656e636520616e6420666c65786962696c6974792c206d616e616765732074696d652077656c6c2c20616e6420706572666f726d7320756e6465722070726573737572652e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 14)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
  INSERT INTO public.evaluation_questions (template_id, section_id, text, text_en, lo_code, question_type, is_required, sequence)
  VALUES (t_id, s_id, convert_from(decode('3420e0b983e0b88ae0b989e0b884e0b8a7e0b8b2e0b8a1e0b884e0b8b4e0b894e0b8aae0b8a3e0b989e0b8b2e0b887e0b8aae0b8a3e0b8a3e0b884e0b98c20e0b981e0b8a5e0b8b0e0b8a1e0b8b520e0b897e0b8b1e0b8a8e0b899e0b884e0b895e0b8b4e0b980e0b88ae0b8b4e0b887e0b89ae0b8a7e0b881e0b983e0b899e0b881e0b8b2e0b8a3e0b980e0b8a3e0b8b5e0b8a2e0b899e0b8a3e0b8b9e0b989e0b8aae0b8b4e0b988e0b887e0b983e0b8abe0b8a1e0b98820e0b980e0b89ee0b8b7e0b988e0b8ad', 'hex'), 'utf8') || convert_from(decode('e0b899e0b8b3e0b8a1e0b8b2e0b89ee0b8b1e0b892e0b899e0b8b2e0b895e0b899e0b980e0b8ade0b887e0b8ade0b8a2e0b988e0b8b2e0b887e0b895e0b988e0b8ade0b980e0b899e0b8b7e0b988e0b8ade0b88720284170706c696573206372656174697669747920616e64206d61696e7461696e73206120706f73697469766520617474697475646520746f77617264206c6966656c6f6e67206c6561726e696e6720666f7220636f6e74696e756f75732073656c662d696d70726f76656d656e742e29', 'hex'), 'utf8'), NULL, NULL, 'rating_scale'::question_type, true, 15)
  RETURNING id INTO q_id;
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '4', '4', NULL, 4, 1);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '3', '3', NULL, 3, 2);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '2', '2', NULL, 2, 3);
  INSERT INTO public.assessment_options (question_id, label_th, label_en, description_th, score, sequence)
  VALUES (q_id, '1', '1', NULL, 1, 4);
END $$;