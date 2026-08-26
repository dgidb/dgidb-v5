# syntax=docker/dockerfile:1

FROM --platform=$BUILDPLATFORM node:24-bookworm-slim AS frontend-build

WORKDIR /build/client

RUN corepack enable && corepack prepare yarn@4.5.1 --activate

COPY client/package.json client/yarn.lock client/.yarnrc.yml ./
RUN yarn install --immutable

COPY client/ ./

ARG REACT_APP_API_URI=/api/graphql
ARG REACT_APP_DOMAIN=

# react-scripts 5 requires the legacy provider with Node's newer OpenSSL.
ENV CI=false \
    GENERATE_SOURCEMAP=false \
    NODE_OPTIONS=--openssl-legacy-provider \
    REACT_APP_API_URI=${REACT_APP_API_URI} \
    REACT_APP_DOMAIN=${REACT_APP_DOMAIN} \
    REACT_APP_ANALYTICS=false

RUN yarn react-scripts build

FROM ruby:4.0.3-slim-bookworm AS app-base

WORKDIR /rails

ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT=development:test \
    PATH=/usr/local/bundle/bin:$PATH

FROM app-base AS app-build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      libyaml-dev \
      pkg-config \
      zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

COPY server/Gemfile server/Gemfile.lock ./
RUN bundle install && \
    rm -rf /root/.bundle "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile -j 1 --gemfile

COPY server/ ./
RUN bundle exec bootsnap precompile -j 1 app/ lib/

RUN rm -rf public
COPY --from=frontend-build /build/client/build/ public/

FROM app-base AS app

LABEL org.opencontainers.image.source="https://github.com/dgidb/dgidb-v5" \
      org.opencontainers.image.description="DGIdb Rails API and React application"

RUN gem install thruster --version 0.1.23 --no-document && \
    groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash

COPY --chown=rails:rails --from=app-build /usr/local/bundle /usr/local/bundle
COPY --chown=rails:rails --from=app-build /rails /rails

USER 1000:1000

ENV RAILS_LOG_TO_STDOUT=1 \
    RAILS_SERVE_STATIC_FILES=1 \
    DGIDB_CONTAINER=1 \
    RAILS_MAX_THREADS=5 \
    TARGET_PORT=3000 \
    HTTP_PORT=80

EXPOSE 80

CMD ["thrust", "bundle", "exec", "puma", "--config", "config/puma.rb"]
