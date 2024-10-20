# Development

To start developing locally, use the following instructions.

See [env/README.md](./env/README.md) for the complete list of environment variables used.

To run the webapp locally, set the following environment variables

```sh
export DEPLOY_STAGE=local
export DNS_DOMAIN=ggbot.org
export PROJECT_SHORT_NAME=ggbot
```

Install dependencies and build packages.

```sh
npm install
npm run build
```

Start webapp with

```sh
npm start
```

To launch linting, type checking and tests:

```sh
npm run eslint
npm run check_types
npm test
```
