"""Copy all source .docx/.pdf/.xlsx files to a local temp dir, forcing OneDrive download."""
import os, shutil, json, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
PARENT = os.path.dirname(ROOT)
TEMP = os.path.join(PARENT, "data", "sources")
os.makedirs(TEMP, exist_ok=True)

with open(os.path.join(PARENT, "_appdata.json"), encoding="utf-8") as f:
    appdata = json.load(f)

copied = 0
skipped = 0
for faculty in appdata:
    for curr in faculty["curricula"]:
        src_rel = curr["file"]
        src = os.path.join(PARENT, src_rel)
        if not os.path.exists(src):
            print(f"MISSING: {src_rel}")
            skipped += 1
            continue
        # Flatten to a safe filename
        safe = src_rel.replace("\\", "_").replace("/", "_")
        dst = os.path.join(TEMP, safe)
        if os.path.exists(dst) and os.path.getsize(dst) > 0:
            copied += 1
            continue
        try:
            shutil.copy2(src, dst)
            copied += 1
            print(f"OK: {safe[:60]} ({os.path.getsize(dst)} bytes)")
        except Exception as e:
            print(f"FAIL: {safe[:60]} — {e}")
            skipped += 1

print(f"\nCopied: {copied}, Skipped: {skipped}")
