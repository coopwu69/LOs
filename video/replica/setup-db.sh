#!/usr/bin/env bash
# Local Postgres 16 replica on :5433 (SSL on, trust auth) for screen capture only.
set -euo pipefail
PGBIN=${PGBIN:-/usr/lib/postgresql/16/bin}
DATA=${PGDATA_DIR:-/tmp/pgdata}
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
mkdir -p "$DATA" && chown postgres "$DATA"
if [ ! -f "$DATA/PG_VERSION" ]; then
  su postgres -c "$PGBIN/initdb -D $DATA -U postgres --auth=trust -E UTF8 --locale=C.UTF-8" >/dev/null
  (cd "$DATA" && openssl req -new -x509 -days 30 -nodes -out server.crt -keyout server.key -subj "/CN=localhost" 2>/dev/null \
    && chown postgres server.* && chmod 600 server.key)
  printf "ssl = on\nlisten_addresses='127.0.0.1'\n" >> "$DATA/postgresql.conf"
  printf "host all all 127.0.0.1/32 trust\nhostssl all all 127.0.0.1/32 trust\n" >> "$DATA/pg_hba.conf"
fi
su postgres -c "$PGBIN/pg_ctl -D $DATA -l $DATA/log -o '-p 5433 -k /tmp' start" || true
sleep 2
psql -h /tmp -p 5433 -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='los'" | grep -q 1 || psql -h /tmp -p 5433 -U postgres -c "CREATE DATABASE los"
PSQL="psql -h /tmp -p 5433 -U postgres -d los -q"
$PSQL -v ON_ERROR_STOP=1 -f "$ROOT/migrations/neon/001_neon_full_schema.sql"
for f in 004_evaluation_drafts_and_submissions 005_editor_schema_compatibility 006_advisor_forms \
         021_add_reviewer_to_template_revisions 022_create_curriculum_review_confirmations 024_create_students_table; do
  $PSQL -f "$ROOT/migrations/$f.sql" >/dev/null
done
python3 "$ROOT/video/replica/seed.py"
