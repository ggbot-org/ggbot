# ggbot

> crypto flow

## Development

TLDR; To start developing locally,

1. Setup your environment variables: install [direnv](./infrastructure/docs/tech-stack.md#direnv) and follow instructions [here to populate environment variables](./env/README.md)

2. Install dependencies and build packages.

```sh
npm ci
npm run build
```

Read [Tech stack](./infrastructure/docs/tech-stack.md) for more details.

To launch linting, type checking and tests:

```sh
npm run lint
npm run check_types
npm test
```

See also [here how to run end to end tests](./infrastructure/docs/end-to-end-tests.md).

## Documentation

-   [Entity-relationship model](./models/docs/entity-relationship.md)
