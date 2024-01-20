# Binance client end to end tests

Build `binance-client` package first

```sh
npm run build -w binance-client
```

Set the following environment variables:

-   `BINANCE_API_KEY`
-   `BINANCE_API_SECRET`
-   `BINANCE_PROXY_BASE_URL`

If script is run on the proxy instance, set `BINANCE_PROXY_BASE_URL` to a Binance API base URL.

```sh
export BINANCE_PROXY_BASE_URL=https://api.binance.com
```

Launch tests:

-   `node binance-client/end-to-end-tests/newOrder.js`
