# Development

To run the webapp locally, set the following environment variables

```sh
export DNS_DOMAIN=ggbot.org
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

Notice that to deploy webapp you need to set the following environment variables

- `DEPLOY_STAGE`
- `PROJECT_SHORT_NAME`
- `STRIPE_PLAN_BASIC_MONTHLY_PRICE`
- `GITHUB_ORG_URL`
- `TELEGRAM_SUPPORT_URL`

See [env/README.md](./env/README.md#envrc-file) for the complete list of environment variables used and how to set them.

To launch linting, type checking and tests:

```sh
npm run eslint
npm run stylelint
npm run check_types
npm test
```

Launch eslint with fix flag: `npm run eslint--fix`.
