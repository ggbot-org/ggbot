# npm dependencies

This is the internal dependencies graph: it shows how workspaces depend on each other.

```mermaid
graph LR
    api --- binance
    api --- locators
    api --- models
    api-admin --- authentication
    api-admin --- database
    api-admin --- s3-data-bucket
    api-auth --- authentication
    api-auth --- database
    api-auth --- email-messages
    api-auth --- s3-data-bucket
    api-public --- database
    api-public --- s3-data-bucket
    api-stripe-action --- authentication
    api-stripe-action --- database
    api-stripe-action --- stripe
    api-stripe-action --- s3-data-bucket
    api-stripe-webhook --- database
    api-stripe-webhook --- stripe
    api-stripe-webhook --- s3-data-bucket
    api-user --- authentication
    api-user --- database
    api-user --- s3-data-bucket
    authentication --- env
    authentication --- models
    backtesting --- dflow
    backtesting-webworker --- backtesting
    backtesting-webworker --- indexeddb-binance
    backtesting-webworker --- webstorage
    binance --- cache
    binance-proxy --- authentication
    binance-proxy --- database
    binance-proxy --- s3-data-bucket
    database --- api
    dflow --- binance
    dflow --- models
    email-messages --- api
    executor --- authentication
    executor --- database
    executor --- dflow
    executor --- email-messages
    executor --- s3-data-bucket
    indexeddb --- models
    indexeddb-binance --- binance
    indexeddb-binance --- indexeddb
    infrastructure --- s3-data-bucket
    infrastructure --- repository
    locators --- env
    s3-data-bucket --- api
    stripe --- api
    webapp --- api
    webapp --- backtesting-webworker
    webstorage --- cache
    webstorage --- models
```
