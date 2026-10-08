# syntax=docker/dockerfile:1

FROM --platform=$BUILDPLATFORM debian:bookworm-slim AS data-download

ARG DGIDB_DATA_RELEASE=latest

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y ca-certificates curl jq && \
    rm -rf /var/lib/apt/lists/*

RUN set -eu; \
    if [ "$DGIDB_DATA_RELEASE" = "latest" ]; then \
      release_endpoint="https://api.github.com/repos/dgidb/dgidb-data/releases/latest"; \
    else \
      release_endpoint="https://api.github.com/repos/dgidb/dgidb-data/releases/tags/$DGIDB_DATA_RELEASE"; \
    fi; \
    mkdir -p /opt/dgidb; \
    curl --fail --location --silent --show-error \
      --header "Accept: application/vnd.github+json" \
      --header "X-GitHub-Api-Version: 2022-11-28" \
      "$release_endpoint" \
      --output /opt/dgidb/release.json; \
    asset_count="$(jq '[.assets[] | select(.name | test("\\.sql\\.gz$"))] | length' /opt/dgidb/release.json)"; \
    [ "$asset_count" -eq 1 ]; \
    asset_url="$(jq --raw-output '.assets[] | select(.name | test("\\.sql\\.gz$")) | .browser_download_url' /opt/dgidb/release.json)"; \
    asset_digest="$(jq --raw-output '.assets[] | select(.name | test("\\.sql\\.gz$")) | .digest' /opt/dgidb/release.json)"; \
    case "$asset_digest" in sha256:*) ;; *) echo "Release asset has no SHA-256 digest" >&2; exit 1 ;; esac; \
    curl --fail --location --silent --show-error "$asset_url" --output /opt/dgidb/data.sql.gz; \
    echo "${asset_digest#sha256:}  /opt/dgidb/data.sql.gz" | sha256sum --check

FROM postgres:18-bookworm AS database-build

ENV PGDATA=/var/lib/dgidb/postgres

COPY --from=data-download /opt/dgidb/data.sql.gz /opt/dgidb/data.sql.gz
COPY server/db/structure.sql /opt/dgidb/structure.sql
COPY --chmod=755 docker/postgres/build-dgidb.sh /usr/local/bin/build-dgidb

RUN build-dgidb && rm -rf /opt/dgidb /usr/local/bin/build-dgidb

# Copying the filesystem into a fresh image retains the official PostgreSQL
# runtime without inheriting its VOLUME declaration. PGDATA stays in the image.
FROM scratch

COPY --from=database-build / /

ARG DGIDB_DATA_RELEASE=latest

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/lib/postgresql/18/bin \
    LANG=en_US.utf8 \
    PG_MAJOR=18 \
    PGDATA=/var/lib/dgidb/postgres

LABEL org.opencontainers.image.source="https://github.com/dgidb/dgidb-v5" \
      org.opencontainers.image.description="PostgreSQL with an initialized read-only DGIdb database" \
      org.dgidb.data.requested-release="${DGIDB_DATA_RELEASE}"

EXPOSE 5432

STOPSIGNAL SIGINT

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["postgres"]
