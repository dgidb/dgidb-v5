#!/usr/bin/env bash
set -Eeuo pipefail

install -d -m 0700 -o postgres -g postgres "$PGDATA"
gosu postgres initdb \
  --username=postgres \
  --auth-local=trust \
  --auth-host=reject

stop_postgres() {
  if [ -s "$PGDATA/postmaster.pid" ]; then
    gosu postgres pg_ctl --pgdata "$PGDATA" --mode=fast --wait stop
  fi
}
trap stop_postgres EXIT

gosu postgres pg_ctl \
  --pgdata "$PGDATA" \
  --options="-c listen_addresses='' -c fsync=off -c full_page_writes=off -c synchronous_commit=off" \
  --wait start

gosu postgres createuser \
  --no-createdb \
  --no-createrole \
  --no-superuser \
  --no-replication \
  dgidb
gosu postgres createdb --owner=postgres dgidb

gosu postgres psql \
  --set=ON_ERROR_STOP=1 \
  --dbname=dgidb \
  --file=/opt/dgidb/structure.sql

gzip --decompress --stdout /opt/dgidb/data.sql.gz | \
  gosu postgres psql \
    --set=ON_ERROR_STOP=1 \
    --dbname=dgidb

gosu postgres psql --set=ON_ERROR_STOP=1 --dbname=dgidb <<-'SQL'
REVOKE ALL ON DATABASE dgidb FROM PUBLIC;
GRANT CONNECT ON DATABASE dgidb TO dgidb;
ALTER ROLE postgres NOLOGIN;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO dgidb;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO dgidb;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO dgidb;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO dgidb;
ALTER ROLE dgidb SET default_transaction_read_only = on;
ALTER DATABASE dgidb SET default_transaction_read_only = on;
VACUUM (FREEZE, ANALYZE);
SQL

stop_postgres
trap - EXIT

cat > "$PGDATA/pg_hba.conf" <<-'HBA'
local dgidb dgidb trust
local all all reject
host dgidb dgidb 0.0.0.0/0 trust
host dgidb dgidb ::0/0 trust
host all all 0.0.0.0/0 reject
host all all ::0/0 reject
HBA

cat >> "$PGDATA/postgresql.conf" <<-'CONF'

# DGIdb is immutable at runtime.
listen_addresses = '*'
autovacuum = off
CONF

chown postgres:postgres "$PGDATA/pg_hba.conf" "$PGDATA/postgresql.conf"
chmod 0600 "$PGDATA/pg_hba.conf" "$PGDATA/postgresql.conf"
