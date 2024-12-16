# Setup the www website

## Naked domain

First of all create an S3 bucket for the naked domain, its name will be `DNS_DOMAIN` and its region the `AWS_DATA_REGION`.
For instance, move to the _Europe (Frankfurt)_ region and create an S3 bucket named `ggbot.org`.
Once created go to bucket _Properties_ tab and enable _Static website hosting_.
Choose _Redirect requests for an object_ to an host named `www.${DNS_DOMAIN}` that is for instance `www.ggbot.org`.
Choose the `https` _protocol_ as latest option.

Go to _CloudFront_ and create a distribution:

- _Origin domain_: the S3 bucket just created, once selected click on _Use website endpoint_
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

Create an S3 bucket for the **www** domain, its name will be `www.${DNS_DOMAIN}` and its region the `AWS_DATA_REGION`.
For instance, move to the _Europe (Frankfurt)_ region and create an S3 bucket named `www.ggbot.org`.
Once created go to bucket _Properties_ tab and enable _Static website hosting_.
Set `index.html` as _Index document_.
Set `error.html` as _Error document_.
Click on _Save changes_ and go to bucket _Permissions_ tab.
On _Block public access (bucket settings)_ click _Edit_ and uncheck the _Block all public access_ flag.
On _Bucket policy_ click _Edit_ and enter a JSON like the following

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::BUCKET_NAME/*"
        }
    ]
}
```

where the string `BUCKET_NAME` is replaced accordingly, for instance it will be

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::www.ggbot.org/*"
        }
    ]
}
```

Go to _CloudFront_ and create a distribution:

- _Origin domain_: the S3 bucket just created, once selected click on _Use website endpoint_
- _Viewer protocol policy_: flag _Redirect HTTP to HTTPS_
- _Web Application Firewall (WAF)_: flat the _Do not enable security protections_ option
- _Alternate domain name (CNAME)_: write down the bucket name
- _Custom SSL certificate_: and ACM certificate should be available in the dropdown.
- _Default root object_: set `index.html`
- Put a description, like `www.ggbot.org - webapp`.

Then on _Route 53_ go to corresponding hosted zone, click on _Create record_ and set:

1. _Record name_: `www`
2. _Record type_: `A`.
3. _Alias_: flag it
4. _Route traffic to_: Cloudfront distribution
5. _Choose distribution_: the one just created

## Deploy webapp

Finally deploy the webapp with

```sh
export DEPLOY_STAGE=main
npm run deploy:webapp
```

Once the webapp is deployed, you can configure SEO via [Google Search](./google-search-setup.md).

### Deploy for testing (optional)

To deploy the webapp on `next` stage follow same instructions for [webapp domain](#webapp-domain) above but for a `next.${DNS_DOMAIN}` domain name. S

Then finally do

```sh
export DEPLOY_STAGE=next
npm run deploy:webapp
```
