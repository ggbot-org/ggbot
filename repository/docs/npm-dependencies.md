
# npm dependencies

This is the internal dependencies graph: it shows how workspaces depend on each other.

```mermaid
graph LR
    workspace/admin-api --- workspace/authentication
    workspace/admin-api --- workspace/database
    workspace/admin-api --- workspace/s3-data-bucket
    workspace/api --- workspace/binance
    workspace/api --- workspace/http
    workspace/api --- workspace/locators
    workspace/api-lambda-user-action --- workspace/authentication
    workspace/api-lambda-user-action --- workspace/database
    workspace/api-lambda-user-action --- workspace/s3-data-bucket
    workspace/authentication --- workspace/env
    workspace/authentication --- workspace/http
    workspace/authentication-api --- workspace/authentication
    workspace/authentication-api --- workspace/database
    workspace/authentication-api --- workspace/email-messages
    workspace/authentication-api --- workspace/s3-data-bucket
    workspace/aws-ec2 --- workspace/aws-types
    workspace/aws-iam --- workspace/aws-types
    workspace/aws-lambda --- workspace/aws-types
    workspace/aws-s3 --- workspace/aws-types
    workspace/aws-ses --- workspace/aws-types
    workspace/backtesting --- workspace/dflow
    workspace/backtesting-webworker --- workspace/backtesting
    workspace/backtesting-webworker --- workspace/indexeddb-binance
    workspace/backtesting-webworker --- workspace/webstorage
    workspace/binance --- workspace/cache
    workspace/binance-client --- workspace/binance
    workspace/binance-proxy --- workspace/aws-ec2
    workspace/binance-proxy --- workspace/authentication
    workspace/binance-proxy --- workspace/binance-client
    workspace/binance-proxy --- workspace/database
    workspace/binance-proxy --- workspace/s3-data-bucket
    workspace/database --- workspace/api
    workspace/database --- workspace/aws-s3
    workspace/database --- workspace/dflow
    workspace/dflow --- workspace/binance
    workspace/dflow --- workspace/models
    workspace/email-messages --- workspace/api
    workspace/email-messages --- workspace/aws-ses
    workspace/env --- workspace/models
    workspace/executor --- workspace/authentication
    workspace/executor --- workspace/database
    workspace/executor --- workspace/email-messages
    workspace/executor --- workspace/s3-data-bucket
    workspace/indexeddb --- workspace/models
    workspace/indexeddb-binance --- workspace/binance
    workspace/indexeddb-binance --- workspace/indexeddb
    workspace/infrastructure --- workspace/aws-ec2
    workspace/infrastructure --- workspace/aws-iam
    workspace/infrastructure --- workspace/aws-lambda
    workspace/infrastructure --- workspace/aws-ses
    workspace/infrastructure --- workspace/database
    workspace/infrastructure --- workspace/s3-data-bucket
    workspace/locators --- workspace/env
    workspace/public-api --- workspace/database
    workspace/public-api --- workspace/s3-data-bucket
    workspace/s3-data-bucket --- workspace/api
    workspace/s3-data-bucket --- workspace/aws-s3
    workspace/stripe --- workspace/api
    workspace/stripe-api --- workspace/authentication
    workspace/stripe-api --- workspace/database
    workspace/stripe-api --- workspace/stripe
    workspace/stripe-api --- workspace/s3-data-bucket
    workspace/webapp --- workspace/api
    workspace/webapp --- workspace/backtesting-webworker
    workspace/webstorage --- workspace/cache
    workspace/webstorage --- workspace/models
```
