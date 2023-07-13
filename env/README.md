# ggbot2 env

The following environment variables are used:

- Required:
  - `AWS_ACCOUNT_ID`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `UTRUST_API_KEY`
  - `UTRUST_WEBHOOK_SECRET`
- Optional
  - `DEPLOY_STAGE`: can be `main`, `next` or `local`. It defaults to `local` if not provided.
  - `NODE_ENV`: can be `production` or `development`. It defaults to `development` if not provided.

A complete _.envrc_ file for production looks like the following

```sh
export NODE_ENV=production

export DEPLOY_STAGE=main

export UTRUST_API_KEY=u_live_api_xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx
export UTRUST_WEBHOOK_SECRET=u_live_webhooks_xxxxxxxx-0000-xxxx-0000-xxxxxxxxxxxx

export AWS_ACCOUNT_ID=12345678
export AWS_ACCESS_KEY_ID=XXX
export AWS_SECRET_ACCESS_KEY=XXX
```
