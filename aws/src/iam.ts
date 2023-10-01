import {
	GetPolicyCommand,
	GetPolicyCommandInput,
	GetPolicyCommandOutput,
	GetPolicyVersionCommand,
	GetPolicyVersionCommandInput,
	GetPolicyVersionCommandOutput,
	IAMClient
} from "@aws-sdk/client-iam"

import { AwsRegion, AwsResource } from "./types.js"

export type { Policy } from "@aws-sdk/client-iam"

const iamVersion = "2012-10-17"

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

const iamClient = (region: AwsRegion) =>
	new IAMClient({ apiVersion: iamVersion, region })

export const getPolicy = async (
	region: AwsRegion,
	PolicyArn: NonNullable<GetPolicyCommandInput["PolicyArn"]>
): Promise<GetPolicyCommandOutput> => {
	const command = new GetPolicyCommand({ PolicyArn })
	const client = iamClient(region)
	return await client.send(command)
}

export const getPolicyVersion = async (
	region: AwsRegion,
	{
		PolicyArn,
		VersionId
	}: Required<Pick<GetPolicyVersionCommandInput, "PolicyArn" | "VersionId">>
): Promise<GetPolicyVersionCommandOutput> => {
	const command = new GetPolicyVersionCommand({ PolicyArn, VersionId })
	const client = iamClient(region)
	return await client.send(command)
}
