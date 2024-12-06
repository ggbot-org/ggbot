# API setup

APIs are implemented by workspaces prefixed by `api-`:

- [api-admin](../../api-admin/)
- [api-auth](../../api-auth/)
- [api-public](../../api-public/)
- [api-stripe-action](../../api-stripe-action/)
- [api-stripe-webhook](../../api-stripe-webhook/)
- [api-user](../../api-user/)

## Deploy an API

To deploy an API, for instance `api-user` launch script

```sh
npm run deploy:api:user
```

Before deploying, you need to create the API: see below.

## Create an API

To create an API, for instance `api-user` launch script

```sh
npm run create:api:user
```

Once an API is created you also need to set its environment variables, for instance

```sh
npm run set_environment:api-user
```

You may also want to set its timeout and memory: go to _AWS Console > Lambda > Functions_ and open the _Configuration > General configuration_ tab for the Lambda function.

Another parameter to set is the logs retention: go to _AWS Console > CloudWatch > Log groups_ and set the retention. A good default may be "1 week".
