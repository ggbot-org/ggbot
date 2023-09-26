import { iamVersion } from "@workspace/aws"
import { DeployStage } from "@workspace/env"

import { Database } from "./Database.js"
import { fqdn } from "./fqdn.js"
import { SesIdentity } from "./SesIdentity.js"
import { Webapp } from "./Webapp.js"

const sesIdentity = new SesIdentity()

const resources = (deployStage: DeployStage) => {
	const database = new Database(deployStage)
	const webapp = new Webapp(deployStage)
	return {
		dataBucketArn: database.s3Bucket.arn,
		webappBucketArn: webapp.s3Bucket.arn
	}
}

// DeployStage main and next resources
const main = resources("main")
const next = resources("next")
// Cross deployStage resources
const cross = {
	// S3
	nakedDomainBucketArn: fqdn.urlShortenerDomain
}

const getDevopsPolicyStatements = () => [
	{
		Effect: "Allow",
		Action: [
			"ec2:DescribeAddresses",
			// "elasticloadbalancing:DescribeLoadBalancers",
			"iam:GetPolicy",
			"logs:CreateLogGroup"
		],
		Resource: "*"
	},
	{
		Effect: "Allow",
		Action: ["s3:CreateBucket", "s3:GetBucketAcl", "s3:ListBucket"],
		Resource: [
			cross.nakedDomainBucketArn,
			main.dataBucketArn,
			main.webappBucketArn,
			next.dataBucketArn,
			next.webappBucketArn
		]
	},
	{
		Effect: "Allow",
		Action: ["s3:DeleteObject", "s3:PutObject"],
		Resource: [
			main.webappBucketArn,
			`${main.webappBucketArn}/*`,
			next.webappBucketArn,
			`${next.webappBucketArn}/*`
		]
	}
]

export const getDevopsPolicy = () => ({
	Version: iamVersion,
	Statement: getDevopsPolicyStatements()
})

const getSesNoreplyPolicyStatements = () => [
	{
		Effect: "Allow",
		Action: ["SES:SendEmail", "SES:SendRawEmail"],
		Resource: sesIdentity.arn
	}
]

export const getSesNoreplyPolicy = () => ({
	Version: iamVersion,
	Statement: getSesNoreplyPolicyStatements()
})
