# API setup

APIs are implemented by workspaces prefixed by `api-`:

- [api-admin](../../api-admin/)
- [api-auth](../../api-auth/)
- [api-public](../../api-public/)
- [api-stripe-action](../../api-stripe-action/)
- [api-stripe-webhook](../../api-stripe-webhook/)
- [api-user](../../api-user/)

## Deploy an API Lambda

Once an API Gateway is created, to deploy and API Lambda is as simple as select the wanted `DEPLOY_STAGE` and run the deploy command, for example

```sh
export DEPLOY_STAGE=main
npm run deploy:api:user
```

Before deploying, you need to create the API Lambda as well as the API Gateway, see below.

## Create an API

To create an API, for instance `api-user` launch script

```sh
npm run create:api:user
```

Once an API is created you also need to set its environment variables.
Wait few seconds, otherwise the action will fail cause the lambda will be in a "Creating" state. Then launch

```sh
npm run set_environment:api-user
```

You may also want to set its timeout and memory: go to _AWS Console > Lambda > Functions_ and open the _Configuration > General configuration_ tab for the Lambda function.

Another parameter to set is the logs retention: go to _AWS Console > CloudWatch > Log groups_ and set the retention. A good default may be "1 week".

## API Gateway

Once an API Lambda is created you need to attach it to an API Gateway endpoint.

First of all, create an API Gateway (one for every deploy stage): go to _AWS Console > API Gateway_ on the `AWS_DATA_REGION` region, create a Gateway of type _REST API_ and name it like `${PROJECT_SHORT_NAME}-api-gateway-${DEPLOY_STAGE}`, for instance `ggbot-api-gateway-main`. Choose _API endpoint type_ **regional**.

Add resources, see [locators api](../../locators/src/api.ts) for implemented endpoints.

A resource must have both `OPTIONS` and its handled methods, for instance all internal APIs are implemented with a `POST`. Choose the corresponding Lambda and flag _Lambda proxy integration_.

Deploy API Gateway: if it is the first time follow the prompt to create a new stage and name it as the API deploy stage. So `ggbot-api-gateway-main` will have a `main` stage. Then click again on _Deploy API_ and choose the corresponding stage.

After first deploy, go to _API Gateway > Custom domain names_ and add a domain name: notice that the domain name depends on the `DNS_DOMAIN` and `DEPLOY_STAGE` environment variables, check [locators FQDN](../../locators/src/FQDNs.ts) for the actual implementation. Select and _ACM Certificate_ (an ACM certificate should be available in the dropdown). _Domain name_ is _public_ and _API endpoint type_ is _regional_. For instance on `main` stage it will be `api.ggbot.org`.

Then click on _Configure API mappings_ and add a new mapping and associate the API with its stage to the domain. Leave the _Path_ blank.

Finally go to _AWS Console > Route 53_ and configure the new domain in the project hosted zone, click on _Create record_ and add the domain configured above

1. _Record name_: the one created above, for instance `api`.
2. _Record type_: `A`.
3. _Alias_: flag it
4. _Route traffic to_: API Gateway API
5. _Region_: Choose same region as API Gateway created above
6. _Choose endpoint_: it should pop up the one just created; same as _API Gateway domain name_ field in _API Gateway > Custom domain names_ for the domain created.
