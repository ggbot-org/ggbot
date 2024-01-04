# _End to end_ tests

Install dependencies,
including [playwright](https://playwright.dev/) and browsers.

```sh
npm ci --include=optional
npm run playwright_install -w end-to-end-tests
```

Run end to end tests.

```sh
npm run end-to-end-tests
```
