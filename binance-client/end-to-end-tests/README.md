# Binance client end to end tests

Set the following environment variables:

-   `BINANCE_API_KEY`
-   `BINANCE_API_SECRET`
-   `BINANCE_PROXY_BASE_URL`

Build `binance-client` package first

```sh
npm run build -w binance-client
```

Then launch tests:

-   `node binance-client/end-to-end-tests/newOrder.js`
