# -*- coding: utf-8 -*-
"""Split the safe SQL file into chunks under 30KB for MCP execute_sql."""
import os
BASE = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(BASE, 'migrations', '003b_create_drafts_safe.sql')
with open(src, encoding='utf-8') as f:
    content = f.read()

# Split on "DO $$" blocks
blocks = content.split('DO $$')
batches = []
for block in blocks[1:]:
    batch = 'DO $$' + block
    if not batch.rstrip().endswith('$$;'):
        batch = batch.rstrip() + '\n$$;\n'
    batches.append(batch)

# Combine small batches to stay under 30KB
combined = []
current = ''
for batch in batches:
    if len(current) + len(batch) > 30000:
        if current:
            combined.append(current)
        current = batch
    else:
        current += '\n' + batch
if current:
    combined.append(current)

outdir = os.path.join(BASE, 'migrations', 'safe_batches')
os.makedirs(outdir, exist_ok=True)
for i, batch in enumerate(combined, 1):
    out = os.path.join(outdir, f'safe_batch_{i:02d}.sql')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(batch)
    print(f'Chunk {i:02d}: {len(batch)} chars')

print(f'\nTotal chunks: {len(combined)}')
