# -*- coding: utf-8 -*-
"""Remove original source documents from git tracking (keep on disk)."""
import subprocess, sys, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Get all tracked files (use -z for null-separated, no quoting/escaping)
result = subprocess.run(['git', 'ls-files', '-z'], capture_output=True)
files = [f.decode('utf-8') for f in result.stdout.split(b'\x00') if f]

# Find files to remove: in numbered folders or .docx/.pdf/.xlsx at root
to_remove = []
for f in files:
    if not f:
        continue
    # Check if it's in a numbered folder (starts with digit followed by . or space)
    first_part = f.split('/')[0] if '/' in f else f
    if (len(first_part) > 0 and first_part[0].isdigit() and
        ('.' in first_part[:3] or ' ' in first_part[:3])):
        to_remove.append(f)
    elif f.lower().endswith(('.docx', '.pdf', '.xlsx')):
        to_remove.append(f)

print(f"Found {len(to_remove)} files to remove from git")
if to_remove:
    # Use git rm --cached with -z for null-separated input
    proc = subprocess.run(
        ['git', 'rm', '--cached', '--quiet', '-z', '--stdin'],
        input='\0'.join(to_remove),
        capture_output=True, text=True, encoding='utf-8'
    )
    if proc.returncode != 0:
        print(f"Error: {proc.stderr}")
        # Fallback: remove one by one
        for f in to_remove:
            r = subprocess.run(['git', 'rm', '--cached', '--quiet', '--', f],
                             capture_output=True, text=True, encoding='utf-8')
            if r.returncode != 0:
                print(f"  Failed: {f[:60]}... - {r.stderr[:80]}")
        print("Fallback done")

# Verify
result2 = subprocess.run(['git', 'ls-files', '-z'], capture_output=True)
remaining = [f.decode('utf-8') for f in result2.stdout.split(b'\x00') if f]
print(f"\nRemaining tracked files: {len(remaining)}")
for f in remaining[:20]:
    print(f"  {f}")
