# DGIdb frontend

The frontend is built with Vite and React.

## Development

Install dependencies with `yarn install`, then start the local environment:

```sh
yarn start
```

Vite reads `.env.local` for this command. Named environments are also available:

```sh
yarn start:staging
yarn start:prod
```

Only variables prefixed with `VITE_` are exposed to browser code.

## Checks and builds

```sh
yarn lint:warn
yarn tsc --noEmit
yarn build          # production
yarn build:dev
yarn build:staging
```

Build output is written to `dist/`.
