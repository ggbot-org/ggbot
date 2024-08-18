# Setup the www website

## Naked domain

First of all create an S3 bucket for the naked domain, its name will be `DNS_DOMAIN` and its region the `AWS_DATA_REGION`.
For instance, move to the _Europe (Frankfurt)_ region and create an S3 bucket names `ggbot.org`.
Once created go to bucket properties and enable _Static website hosting_.
Choose _Redirect requests for an object_ to an host named `www.${DNS_DOMAIN}` that is for instance `www.ggbot.org`.
Choose the `https` _protocol_ as latest option.

Go to _CloudFront_ and create a distribution:

- _Origin domain_: the S3 bucket just created
- _Web Application Firewall (WAF)_: flat the _Do not enable security protections_ option
- _Alternate domain name (CNAME)_: write down the bucket name
- _Custom SSL certificate_: and ACM certificate should be available in the dropdown.
- Put a description, like `ggbot.org - naked domain`.

Then on _Route 53_ go to corresponding hosted zone, click on _Create record_ and set:

1. _Record name_: leave it empty
2. _Record type_: `A`.
3. _Alias_: flag it
4. _Route traffic to_: Cloudfront distribution
5. _Choose distribution_: the one just created

## Webapp domain

TODO

## Deploy webapp

Finally deploy the webapp with

```sh
export DEPLOY_STAGE=main
npm run deploy:webapp
```
