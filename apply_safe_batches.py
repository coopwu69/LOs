# -*- coding: utf-8 -*-
"""Apply safe_batch SQL files to remote Supabase via the sql-bulk-import Edge Function."""
import os, sys, json, urllib.request, urllib.error

EDGE_URL = "https://jbhrjjrlxaqwaqtdbzav.supabase.co/functions/v1/sql-bulk-import"
SECRET = "bulk-import-secret-2026"

BASE = os.path.dirname(os.path.abspath(__file__))
batch_dir = os.path.join(BASE, "migrations", "safe_batches")
files = sorted(f for f in os.listdir(batch_dir) if f.endswith(".sql"))

print(f"Found {len(files)} batch files")
success_count = 0
fail_count = 0

for fname in files:
    path = os.path.join(batch_dir, fname)
    with open(path, encoding="utf-8") as fh:
        sql = fh.read()
    print(f"  Applying {fname} ({len(sql)} chars)... ", end="", flush=True)
    req = urllib.request.Request(
        EDGE_URL,
        data=sql.encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "text/plain; charset=utf-8",
            "x-import-secret": SECRET,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            if result.get("success"):
                print("OK")
                success_count += 1
            else:
                print(f"FAILED: {result.get('error', 'unknown')}")
                fail_count += 1
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        print(f"HTTP {e.code}: {err_body[:200]}")
        fail_count += 1
    except Exception as e:
        print(f"ERROR: {e}")
        fail_count += 1

print(f"\nDone: {success_count} succeeded, {fail_count} failed")
sys.exit(1 if fail_count else 0)
