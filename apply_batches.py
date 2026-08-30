# -*- coding: utf-8 -*-
"""Apply batch SQL files to Supabase via REST API using the publishable key.
This bypasses RLS by using the service role key if available, or we use execute_sql via MCP.
Since we can't call MCP from Python, this script just prints each batch for manual application."""
import os, json
BASE = os.path.dirname(os.path.abspath(__file__))
batchdir = os.path.join(BASE, 'migrations', 'batches')
files = sorted(os.listdir(batchdir))
for f in files:
    path = os.path.join(batchdir, f)
    with open(path, encoding='utf-8') as fh:
        content = fh.read()
    print(f"=== {f} ({len(content)} chars) ===")
    # Print first 100 chars for verification
    print(content[:100])
    print("...")
    print()
