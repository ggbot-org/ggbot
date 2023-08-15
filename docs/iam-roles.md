# IAM roles

## Roles

TODO: cleanup these roles

- ggbot2-main-ec2-role
- ggbot2-next-ec2-role
- ggbot2_api_role

When creating a IAM role for a service, select:

- Trusted entity type: _AWS service_
- Use case: _EC2_.

### binance-proxy

Create a IAM role for _binance-proxy_ service with name `ggbot2-binance-proxy-role`.

Add [CodeCommit policy](#codecommit-policy).

### executor

Create a IAM role for _executor_ service with name `ggbot2-executor-role`.

Add policies:

- [CodeCommit policy](#codecommit-policy)
- [S3 data policy](#s3-data)

## Policies

TODO: cleanup these policies (among others)

- ggbot2-codecommit-readonly-policy
- ggbot2-main-s3-readwrite-data-policy
- ggbot2-next-s3-readwrite-data-policy
- ggbot2-lambda-ses-policy
- ggbot2-next-ses-noreply-policy
- ggbot2-devops-policy
- ggbot2_lambda_invoke_policy

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
