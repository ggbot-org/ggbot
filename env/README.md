# ggbot2 env

The following environment variables are used:

- `AWS_ACCOUNT_ID`
- `UTRUST_API_KEY`
- `UTRUST_WEBHOOK_SECRET`
- `BINANCE_PROXY_BASE_URL`: for example `export BINANCE_PROXY_BASE_URL="http://3.68.165.141:8080"`
- `DEPLOY_STAGE`: can be `main`, `next` or `local`. It defaults to `local` if not provided.
- `NODE_ENV`: can be `production` or `development`. It defaults to `development` if not provided.
- `JWT_SECRET`: used by APIs for authentication.

# .envrc file

A complete _.envrc_ file for production looks like the following

```sh
export AWS_ACCOUNT_ID=12345678

export DEPLOY_STAGE=main
export JWT_SECRET=s3cret

export UTRUST_API_KEY=u_live_api_xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx
export UTRUST_WEBHOOK_SECRET=u_live_webhooks_xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx
```
