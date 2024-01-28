# Binance client end to end tests

Build `binance-client` package first

```sh
npm run build -w binance-client
```

Set the following environment variables:

-   `BINANCE_API_KEY`
-   `BINANCE_API_SECRET`

Notice that the test must run from a host that has a whitelisted IP address.

Launch tests:

-   `node binance-client/end-to-end-tests/newOrder.js`
