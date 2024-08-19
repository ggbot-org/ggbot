
// TODO remove unused (commented)
const iamActions = [
	// "s3:GetBucketAcl",
	"SES:SendEmail",
	"SES:SendRawEmail",
	"ec2:AssociateAddress",
	"ec2:DescribeAddresses",
	"ec2:DisassociateAddress",
	"iam:PassRole",
	"lambda:CreateFunction",
	"lambda:UpdateFunctionCode",
	"lambda:UpdateFunctionConfiguration",
	"logs:CreateLogGroup",
	"logs:PutRetentionPolicy",
	"s3:DeleteObject",
	"s3:GetObject",
	"s3:ListBucket",
	"s3:PutObject",
] as const
export type IamAction = (typeof iamActions)[number]
