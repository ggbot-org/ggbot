# Environment variables

The following environment variables are used:

-   `AUTHENTICATION_SECRET`: used by APIs for authentication.
-   `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: used locally, are AWS CLI credentials for [_devops_ account](../infrastructure/docs/aws-boostrap.md#devops-account).
-   `AWS_ACCOUNT_ID`: used locally for devops.
-   `AWS_BINANCE_PROXY_REGION`: for example `eu-central-1`.
-   `AWS_DATA_REGION`: for example `eu-central-1`.
-   `AWS_SES_REGION`: for example `us-east-1`.
-   `BINANCE_PROXY_IP`: for example `1.2.3.4`.
-   `DEPLOY_STAGE`: can be `main`, `next` or `local`.
-   `DNS_DOMAIN`: _example.com_.
-   `PROJECT_SHORT_NAME`: string used for example as a prefix for resource names.
-   Used by Stripe APIs for payments:
    -   `STRIPE_SECRET_KEY`
    -   `STRIPE_WEBHOOK_SECRET`
    -   `STRIPE_PLAN_BASIC_MONTHLY_PRICE`
    -   `STRIPE_PLAN_BASIC_PRICE_ID`

Optional environment variables needed to launch [binance-client end to end tests](../binance-client/docs/end-to-end-tests.md).

-   `BINANCE_API_KEY`
-   `BINANCE_API_SECRET`

## .envrc file

Install [direnv](../infrastructure/docs/tech-stack.md#direnv): it reads a _.envrc_ file and set environment variables automatically.

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

export BINANCE_PROXY_IP=1.2.3.4

export STRIPE_SECRET_KEY=xxx
export STRIPE_WEBHOOK_SECRET=xxx
export STRIPE_PLAN_BASIC_PRICE_ID=xxx
export STRIPE_PLAN_BASIC_MONTHLY_PRICE=2

export BINANCE_API_KEY=xxx
export BINANCE_API_SECRET=xxx
```
