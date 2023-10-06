# npm dependencies

This is the internal dependencies graph: it shows how workspaces depend on each other.

```mermaid
graph LR
    workspace/admin-api --- workspace/authentication
    workspace/admin-api --- workspace/api-gateway
    workspace/admin-api --- workspace/database
    workspace/api --- workspace/http
    workspace/api --- workspace/models
    workspace/api-gateway --- workspace/api
    workspace/api-gateway --- workspace/locators
    workspace/authentication --- workspace/env
    workspace/authentication --- workspace/models
    workspace/authentication-api --- workspace/api-gateway
    workspace/authentication-api --- workspace/authentication
    workspace/authentication-api --- workspace/database
    workspace/binance --- workspace/cache
    workspace/binance-client --- workspace/binance
    workspace/binance-proxy --- workspace/aws
    workspace/binance-proxy --- workspace/binance
    workspace/binance-proxy --- workspace/logging
    workspace/binance-proxy --- workspace/http
    workspace/database --- workspace/aws
    workspace/database --- workspace/binance-client
    workspace/database --- workspace/dflow
    workspace/database --- workspace/email-messages
    workspace/database --- workspace/locators
    workspace/database --- workspace/logging
    workspace/dflow --- workspace/binance
    workspace/email-messages --- workspace/models
    workspace/executor --- workspace/database
    workspace/infrastructure --- workspace/database
    workspace/infrastructure --- workspace/repository
    workspace/locators --- workspace/env
    workspace/logging --- workspace/env
    workspace/public-api --- workspace/api-gateway
    workspace/public-api --- workspace/database
    workspace/url-shortener --- workspace/locators
    workspace/user-api --- workspace/api-gateway
    workspace/user-api --- workspace/authentication
    workspace/user-api --- workspace/database
    workspace/utrust-api --- workspace/api-gateway
    workspace/utrust-api --- workspace/database
    workspace/webapp --- workspace/api
    workspace/webapp --- workspace/dflow
    workspace/webapp --- workspace/locators
```
