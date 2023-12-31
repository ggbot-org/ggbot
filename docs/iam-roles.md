# IAM roles

## EC2 Roles

When creating a IAM role for an EC2 service, select:

-   Trusted entity type: _AWS service_
-   Use case: _EC2_.

### ec2-base

Create a IAM role to be used on AMI creation with name `ggbot2-ec2-base-role`.

Add [CodeCommit policy](#codecommit).

### binance-proxy

Create a IAM role for _binance-proxy_ service with name `ggbot2-binance-proxy-role`.

Add policies:

-   [CodeCommit policy](#codecommit)
-   [S3 data policy](#elastic-ips)

### executor

Create a IAM role for _executor_ service with name `ggbot2-executor-role`.

Add policies:

-   [CodeCommit policy](#codecommit)
-   [Elastic IPs policy](#s3-data)

## Policies

### CodeCommit

Create a IAM policy with name `ggbot2-codecommit-readonly-policy`.

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": "codecommit:GitPull",
			"Resource": "arn:aws:codecommit:eu-central-1:888671539518:ggbot2-monorepo"
		}
	]
}
```

### Elastic IPs

Create a IAM policy with name `ggbot2-elastic-ips-policy`

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": ["ec2:ReleaseAddress", "ec2:AssociateAddress"],
			"Resource": [
				"arn:aws:ec2:*:888671539518:network-interface/*",
				"arn:aws:ec2:*:888671539518:elastic-ip/*",
				"arn:aws:ec2:*:888671539518:instance/*"
			]
		},
		{
			"Effect": "Allow",
			"Action": "ec2:DescribeAddresses",
			"Resource": "*"
		}
	]
}
```

### S3 data

Create a IAM policy with name `ggbot2-s3-readwrite-data-policy`

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"s3:PutObject",
				"s3:GetObject",
				"s3:ListBucket",
				"s3:DeleteObject"
			],
			"Resource": [
				"arn:aws:s3:::main-data.eu-central-1.ggbot2.com/*",
				"arn:aws:s3:::main-data.eu-central-1.ggbot2.com",
				"arn:aws:s3:::next-data.eu-central-1.ggbot2.com/*",
				"arn:aws:s3:::next-data.eu-central-1.ggbot2.com"
			]
		}
	]
}
```
