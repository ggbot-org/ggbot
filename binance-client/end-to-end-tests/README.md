# Binance client end to end tests

Build `binance-client` package first

```sh
npm run build -w binance-client
```

Set the following environment variables:

-   `BINANCE_API_BASE_URL`
-   `BINANCE_API_KEY`
-   `BINANCE_API_SECRET`

If script is run on the proxy instance, set `BINANCE_API_BASE_URL` to a Binance API base URL.

```sh
export BINANCE_API_BASE_URL=https://api1.binance.com
```

Launch tests:

-   `node binance-client/end-to-end-tests/newOrder.js`
