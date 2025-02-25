# Stripe bootstrap

Create a [Stripe](https://stripe.com) account and perform the following instructions to set it up.
You will be asked to provide all the legal information related to your Company in order to enable your _Stripe_ account.

See [env/README.md](../../env/README.md) for information about environment variables mentioned below.

## Stripe modes

Notice that Stripe provides _test_ and _live_ modes.
You can start with _test_ mode where you can use a test credit card number, for instance `4242 4242 4242 4242`.
To accept real money transactions you need to switch to _live_ mode.

Notice that all `STRIPE_` prefixed environment variables mentioned below has two values, one for _test_ mode and one for _live_ mode.
It is important to set the environment variables consistenly with the `DEPLOY_STAGE` variable, where

- `DEPLOY_STAGE=next` is associated with Stripe _test_ mode
- `DEPLOY_STAGE=main` is associated with Stripe _live_ mode

The further `DEPLOY_STAGE=local`, which is used for local development is not associated with any Stripe mode.

## API keys

Go the Stripe and set the `STRIPE_SECRET_KEY` environment variable, see [API keys related documentation](https://docs.stripe.com/keys).

## Products and pricing

Create a product for the "Basic" plan and a pricing for it and set the `STRIPE_PLAN_BASIC_PRICE_ID` environment variable.
See the following documentation for more details on how to create products and pricing:

- [Products](https://docs.stripe.com/api/products)
- [Price](https://docs.stripe.com/api/prices)

Notice that you need to manually sync the pricing on Stripe dashboard with the following environment variables:

- `STRIPE_PLAN_BASIC_MONTHLY_PRICE`

You may need to upload the logo, see [here where to find it](../../webapp/docs/logo-assets.md).

## Webhook

Create a webhook endpoint with command

```sh
npm run stripe:create_webhook
```

See also [Stripe Webhooks documentation](https://docs.stripe.com/api/webhook_endpoints).
