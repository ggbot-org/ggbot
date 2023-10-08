# ggbot2 environment variables

The following environment variables are used:

-   `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: used locally, must be keys for _ggbot2-devops_ user.
-   `AWS_ACCOUNT_ID`: used locally for devops.
-   `AWS_BINANCE_PROXY_REGION`: for example `eu-central-1`.
-   `AWS_DATA_REGION`: for example `eu-central-1`.
-   `AWS_SES_REGION`: for example `us-east-1`.
-   `BINANCE_PROXY_BASE_URL`: for example `https://binance-proxy.example.com`.
-   `BINANCE_PROXY_ELASTIC_IPS`: for example `3.65.45.176,3.68.165.141`.
-   `DEPLOY_STAGE`: can be `main`, `next` or `local`. It defaults to `local` if not provided.
-   `DNS_DOMAIN`: _example.com_.
-   `JWT_SECRET`: used by APIs for authentication.
-   `PROJECT_SHORT_NAME`: string used for example as a prefix for resource names.
-   `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`: used by Strupe APIs for payments.
-   `UTRUST_API_KEY` and `UTRUST_WEBHOOK_SECRET`: used by Utrust APIs for payments.

# .envrc file

A complete _.envrc_ file looks like the following

```sh
export DNS_DOMAIN=example.org

export PROJECT_SHORT_NAME=brand

export AWS_ACCOUNT_ID=12345678
export AWS_ACCESS_KEY_ID=AKIA123ABCDEFGHIKLMN
export AWS_SECRET_ACCESS_KEY=O1234567890aBcDeFgHiJkLmNoPqRsTuVwXyZ

export AWS_BINANCE_PROXY_REGION=eu-central-1
export AWS_DATA_REGION=eu-central-1
export AWS_SES_REGION=us-east-1

export DEPLOY_STAGE=main
export JWT_SECRET=s3cret

export BINANCE_PROXY_BASE_URL=https://binance-proxy.ggbot2.com
export BINANCE_PROXY_ELASTIC_IPS=3.65.45.176,3.68.165.141,3.77.223.177

export UTRUST_API_KEY=u_live_api_xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx
export UTRUST_WEBHOOK_SECRET=u_live_webhooks_xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx

export STRIPE_SECRET_KEY=xxx
export STRIPE_WEBHOOK_SECRET=xxx
```
