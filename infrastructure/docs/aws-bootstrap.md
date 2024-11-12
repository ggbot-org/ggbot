# AWS bootsrap

Create an [Amazon Web Services](https://aws.amazon.com) account and perform the following instructions to set it up.

See [env/README.md](../../env/README.md) for information about environment variables mentioned below.

Get the AWS account id and set the `AWS_ACCOUNT_ID` environment variable.

```sh
export AWS_ACCOUNT_ID=888777666555
```

Choose a string to prefix project entities and set `PROJECT_SHORT_NAME` environment variable, for instance **ggbot**.

```sh
export export PROJECT_SHORT_NAME=ggbot
```

## Admin accounts

You should not access the _AWS Console_ using the _root_ account.
Go to _IAM_ and create a **superpowers** user group. Attach it the following policies:

- PowerUserAccess
- IAMFullAccess
- IAMUserSSHKeys

Create at least one admin account, to be used with the _AWS console_, and add it to the group.

Notice that you do not need to generate AWS secret and access keys for the account, you can use _AWS Cloud Shell_ instead.

## Choose a data region

Choose an AWS region to host your data, for instance **ggbot data** and activities will be inside **Europe** and let's go for _Europe (Frankfurt)_ region (which identifier is `eu-central-1`). Once you chose a region, set the environment variable `AWS_DATA_REGION` as

```sh
export AWS_DATA_REGION=eu-central-1
```

Notice that **this choice cannot be changed** as any other configuration parameter
and must be clearly exposed on the _Terms of Service_ and _Privacy Policy_ pages.

## DNS domain

Buy a domain, for instance _ggbot.com_ and set the `DNS_DOMAIN` environment variable.
You can get a domain on [Amazon Route 53](https://aws.amazon.com/it/route53/).
In any case, you need to add your domain to _Route 53_ as hosted zone.
Notice that it may take up to 48 hours for DNS records to propagate on the Internet.

## SSL certificate

Create an SSL certificate with [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) (ACM).

Go to ACM on AWS console, check that you are in the wanted AWS region, for instance, _eu-central-1 Europe (Frankfurt)_.
Click on "Request a certificate", flag "Request a public certificate" and click "Next".
Use `DNS_DOMAIN` as "Fully qualified domain name", for instance `ggbot.org`.
Click on "Add another name to this certificate" and add a third level domain **wildcard**, for instance, `*.ggbot.org`.
Choose "DNS validation" as validation method. Default _RSA 2048_ algorithm is fine.
Click "Request", then go to the certificates status, find the button "Create records in Route 53" and complete the DNS validation.

Create another certificate with exactly the same steps of the previous one but in _us-east-1 US East (N. Virginia)_.
It is needed by _Cloudfront_ distributions.

## Further steps

The following steps are needed, order matters:

1. [Devops account setup](./devops-account-setup.md)
2. [Create the main website](./www-setup.md)
3. [SES setup](./ses-setup.md)
4. [IAM setup](./iam-setup.md)

Continue with the following steps in any order:

- [S3 storage lens](./s3-storage-lens.md)
- [EC2 Auto Scaling groups](./ec2-auto-scaling-groups.md)
- [Cost management](./aws-cost-management.md)

TODO complete steps list

Finally try out the [end to end tests](./end-to-end-tests.md)
