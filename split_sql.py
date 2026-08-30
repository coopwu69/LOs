# -*- coding: utf-8 -*-
"""Split 003_create_draft_templates.sql into smaller batch files."""
import os
BASE = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(BASE, 'migrations', '003_create_draft_templates.sql')
with open(src, encoding='utf-8') as f:
    content = f.read()

# Split on "DO $$" blocks
blocks = content.split('DO $$')
# First chunk is the header comment
header = blocks[0]
batches = []
for i, block in enumerate(blocks[1:], 1):
    batch = 'DO $$' + block
    if not batch.rstrip().endswith('$$;'):
        batch = batch.rstrip() + '\n$$;\n'
    batches.append(batch)

# Write batches to separate files
outdir = os.path.join(BASE, 'migrations', 'batches')
os.makedirs(outdir, exist_ok=True)
for i, batch in enumerate(batches, 1):
    out = os.path.join(outdir, f'batch_{i:02d}.sql')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(batch)
    print(f'Batch {i:02d}: {len(batch)} chars -> {out}')

print(f'\nTotal batches: {len(batches)}')
