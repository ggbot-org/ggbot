# ggbot2 env

The following environment variables are used

- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DEPLOY_STAGE`: can be `main` or `next`. It defaults to `next` if not provided.
- `NEXT_PUBLIC_DEPLOY_STAGE`: expose `DEPLOY_STAGE` to browser context.
- `NODE_ENV`: can be `production` or `development`. It defaults to `development` if not provided.
- `NEXT_PUBLIC_NODE_ENV`: expose `NODE_ENV` to browser context.
- `STRIPE_PURCHASE_API_KEY`
- `STRIPE_BASIC_PLAN_PRODUCT_ID`

