# Environment variables

The following environment variables are used:

-   `AUTHENTICATION_SECRET`: used by APIs for authentication.
-   `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: used locally, are AWS CLI credentials for [_devops_ account](../infrastructure/docs/aws-boostrap.md#devops-account).
-   `AWS_ACCOUNT_ID`: used locally for devops.
-   `AWS_BINANCE_PROXY_REGION`: for example `eu-central-1`.
-   `AWS_DATA_REGION`: for example `eu-central-1`.
-   `AWS_SES_REGION`: for example `us-east-1`.
-   `BINANCE_PROXY_BASE_URL`: for example `http://3.65.45.176:3000`.
-   `BINANCE_PROXY_ELASTIC_IPS`: for example `3.65.45.176,3.68.165.141`.
-   `DEPLOY_STAGE`: can be `main`, `next` or `local`. It defaults to `local` if not provided.
-   `DNS_DOMAIN`: _example.com_.
-   `PROJECT_SHORT_NAME`: string used for example as a prefix for resource names.
-   `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`: used by Strupe APIs for payments.

Optional environment variables needed to launch [binance-client end to end tests](../binance-client/end-to-end-tests/README.md).

-   `BINANCE_API_KEY`
-   `BINANCE_API_SECRET`

## .envrc file

A complete _.envrc_ file looks like the following

```sh
export DNS_DOMAIN=example.com

export PROJECT_SHORT_NAME=brand

export AWS_ACCOUNT_ID=12345678
export AWS_ACCESS_KEY_ID=AKIA123ABCDEFGHIKLMN
export AWS_SECRET_ACCESS_KEY=O1234567890aBcDeFgHiJkLmNoPqRsTuVwXyZ

export AWS_BINANCE_PROXY_REGION=eu-central-1
export AWS_DATA_REGION=eu-central-1
export AWS_SES_REGION=us-east-1

export DEPLOY_STAGE=main

export AUTHENTICATION_SECRET=s3cret

export BINANCE_API_BASE_URL=http://3.65.45.176:3000
export BINANCE_PROXY_ELASTIC_IPS=3.65.45.176,3.123.148.141

export STRIPE_SECRET_KEY=xxx
export STRIPE_WEBHOOK_SECRET=xxx

export BINANCE_API_KEY=xxx
export BINANCE_API_SECRET=xxx
```
