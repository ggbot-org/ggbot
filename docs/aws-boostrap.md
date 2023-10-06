# AWS bootsrap

Create an [Amazon Web Services](https://aws.amazon.com) account and perform the following instructions to set it up.

See [env/README.md](../env/README.md) for information about environment variables mentioned below.

Get the AWS account id and set the `AWS_ACCOUNT_ID` environment variable.

Choose a string to prefix project entities and set `PROJECT_SHORT_NAME` environment variable, for instance **ggbot**.

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

Compile _infrastructure_ tests

```sh
npm run tsc:test -w infrastructure
```

Check devops policy

```sh
node infrastructure/temp/DevopsPolicy_test.js
```

next step is to run single infrastructure test to check policy, and run it actively to fix the policy.
TODO how to run a single test, does node --test --test-name-pattern work? Can it be passed to `npm run test_infrastructure` as parameter?
TODO link infrastructure README and add other steps there.

## DNS domain

Buy a domain, for instance _example.com_ and set the `DNS_DOMAIN` environment variable.

## SSL certificate

Go to [AWS Certficate Manager](https://aws.amazon.com/certificate-manager/) and create an SSL certificate.
TODO add instructions
