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

## Choose a data region

Choose an AWS region to host your data, for instance let's assume **ggbot data** and activities will be inside **Europe** and let's go for _Europe (Frankfurt)_ region (which identifier is `eu-central-1`). Once you chose a region, set the environment variable `AWS_DATA_REGION` as

```sh
export AWS_DATA_REGION=eu-central-1
```

## DNS domain

Buy a domain, for instance _ggbot.com_ and set the `DNS_DOMAIN` environment variable.
You can get a domain on [Amazon Route 53](https://aws.amazon.com/it/route53/).
In any case, you need to add your domain to _Route 53_ as hosted zone.

## SSL certificate

Create an SSL certificate with [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) (ACM).

Go to ACM on AWS console, check that you are in the wanted AWS region, for instance, _eu-central-1 Europe (Frankfurt)_.
Click on "Request a certificate", flag "Request a public certificate" and click "Next".
Use `DNS_DOMAIN` as "Fully qualified domain name", for instance `ggbot.org`.
Click on "Add another name to this certificate" and add a third level domain **wildcard**, for instance, `*.ggbot.org`.
Choose "DNS validation" as validation method. Default _RSA 2048_ algorithm is fine.
Click "Request", then go to the certificates status, find the button "Create records in Route 53" and complete the DNS validation.

## SES - Amazon Simple Email Service

Setup your project email, for example to send email from an address like `noreply@ggbot.org`.

Choose an AWS region, it can be the same as _ggbot data_ region for instance _Europe (Frankfurt)_,
in that case set the environment variable `AWS_SES_REGION` as

```sh
export AWS_SES_REGION=eu-central-1
```

Go to SES on AWS console, select the choosen region and configure a new identity which _Identity type_ will be **Domain**.
Insert your DNS domain, for example `ggbot.org`.
Expand _Advanced DKIM settings_ and select _Easy DKIM_ with **RSA_2048_BIT** _DKIM signing key length_.
Finally click on _Create Identity_ then go for _Publish DNS records to Route53_.

Once the email domain address is verified, your SES enters in a sandbox.

## Devops account

Create a _devops_ account. Once the IAM permissions are set, every other operation can be done by infrastructure automation.

Go to _IAM > Policies_ and click _Create policy_.
Choose name `${PROJECT_SHORT_NAME}-devops-policy`, for instance _ggbot-devops-policy_.
Add the following JSON.

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": ["iam:GetPolicy", "iam:GetPolicyVersion"],
			"Resource": "*"
		}
	]
}
```

TODO notice the wildcard in Resource will be fixed on infrastructure test step below

TODO add also permissions to update policy.

Go to _IAM > Users_ and click _Create user_.
As user name, choose `${PROJECT_SHORT_NAME}-devops`, for instance _ggbot-devops_.
On "Set permissions" choose "Attach policies directly" and choose previously created policy.

Once the user is created, go to user IAM page, for instance _IAM > Users > ggbot-devops_. Go to _Security credentials_ tab and click _Create access key_.
Get the access keys and set environment variables:

-   `AWS_ACCESS_KEY_ID`
-   `AWS_SECRET_ACCESS_KEY`

To check devops policy run

```sh
npm run test_infrastructure:aws:bootstrap
```

Of course, the test is expected to fail on first run. To update devops policy run

```sh
TODO npm run push_infrastructure:aws:bootstrap
```

## Further steps

Continue with the following steps:

- [S3 storage lens](./s3-storage-lens.md)
- [EC2 Auto Scaling groups](./ec2-auto-scaling-groups.md)

TODO complete steps list

Finally try out the [end to end tests](./end-to-end-tests.md)
