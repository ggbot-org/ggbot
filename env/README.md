# ggbot2 env

The following environment variables are used:

- Required:
  - `AWS_ACCOUNT_ID`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `UTRUST_API_KEY`
- Optional
  - `DEPLOY_STAGE`: can be `main` or `next`. It defaults to `next` if not provided.
  - `NEXT_PUBLIC_DEPLOY_STAGE`: expose `DEPLOY_STAGE` to browser context.
  - `NODE_ENV`: can be `production` or `development`. It defaults to `development` if not provided.
  - `NEXT_PUBLIC_NODE_ENV`: expose `NODE_ENV` to browser context.

A complete *.envrc* file for production looks like the following

```sh
export NODE_ENV=production
export NEXT_PUBLIC_NODE_ENV=production

export DEPLOY_STAGE=main
export NEXT_PUBLIC_DEPLOY_STAGE=main

export UTRUST_API_KEY=u_live_api_ec6a0684-4f41-4f3c-b059-548dec333ad7

export AWS_ACCOUNT_ID=12345678
export AWS_ACCESS_KEY_ID=XXX
export AWS_SECRET_ACCESS_KEY=XXX
```

