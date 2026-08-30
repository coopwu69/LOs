# -*- coding: utf-8 -*-
import json, os
BASE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE, '_parsed.json'), encoding='utf-8') as f:
    parsed = json.load(f)
lines = ['-- Update parse_status and confidence for all source documents']
for r in parsed:
    fname = r['filename'].replace("'", "''")
    lines.append(f"UPDATE public.assessment_source_documents SET parse_status = '{r['parse_status']}', extraction_confidence = {r['confidence']} WHERE filename = '{fname}';")
sql = '\n'.join(lines)
with open(os.path.join(BASE, 'migrations', '003a_update_parse_status.sql'), 'w', encoding='utf-8') as f:
    f.write(sql)
print(f'Parse status SQL: {len(sql)} chars')
