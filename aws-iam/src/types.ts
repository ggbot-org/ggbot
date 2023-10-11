import { AwsResource } from "@workspace/aws-types"

import { iamVersion } from "./client.js"

export type { Policy } from "@aws-sdk/client-iam"

const policyDocumentStatementActions = [
	"acm:ListCertificates",
	"ec2:DescribeAddresses",
	"elasticloadbalancing:DescribeLoadBalancers",
	"iam:GetPolicy",
	"iam:GetPolicyVersion",
	"iam:PassRole",
	"lambda:CreateFunction",
	"lambda:UpdateFunctionCode",
	"lambda:UpdateFunctionConfiguration",
	"s3:CreateBucket",
	"s3:GetBucketAcl",
	"s3:ListBucket",
	"s3:DeleteObject",
	"s3:PutObject"
] as const
export type PolicyDocumentStatementAction =
	(typeof policyDocumentStatementActions)[number]

export type PolicyDocumentStatement = {
	Action: PolicyDocumentStatementAction[]
	Effect: "Allow"
	Resource: AwsResource["arn"]
}

export type PolicyDocument = {
	Version: typeof iamVersion
	Statement: PolicyDocumentStatement[]
}
