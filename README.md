# ggbot

> crypto flow

## Development

To start developing locally, use the following instructions.

Set your environment variables, `DEPLOY_STAGE` and `DNS_DOMAIN`.

```sh
export DEPLOY_STAGE=local
export DNS_DOMAIN=ggbot.org
```

Install [direnv](./infrastructure/docs/tech-stack.md#direnv) and follow instructions [here to populate other environment variables](./env/README.md), if needed.

Install dependencies and build packages.

```sh
npm ci
npm run build
```

Start webapp.

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
