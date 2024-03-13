# ggbot

> crypto flow

## Development

To start developing locally, use the following instructions.

See [env/README.md](./env/README.md) for the complete list of environment variables used.

To run the webapp locally, set environment variables `DEPLOY_STAGE` and `DNS_DOMAIN`.

```sh
export DEPLOY_STAGE=local
export DNS_DOMAIN=ggbot.org
```

Install dependencies and build packages.

```sh
npm ci
npm run build
```

Start webapp with

```sh
npm start
```

To launch linting, type checking and tests:

```sh
npm run lint
npm run check_types
npm test
```

## Documentation

-   [Authentication](./authentication/README.md)
-   [Entity-relationship model](./models/docs/entity-relationship.md)
