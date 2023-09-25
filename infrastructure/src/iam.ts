import { DeployStage, ENV } from "@workspace/env"

import { Database } from "./Database.js"
import { fqdn } from "./fqdn.js"
import { lambdaAllArn } from "./lambda.js"
import { getSesIdentityArn } from "./ses.js"
import { Webapp } from "./Webapp.js"

const { AWS_ACCOUNT_ID, DEPLOY_STAGE } = ENV

// IAM version
const Version = "2012-10-17"

const resources = (deployStage: DeployStage) => {
	const database = new Database(deployStage)
	const webapp = new Webapp(deployStage)
	return {
		dataBucketArn: database.s3Bucket.arn,
		webappBucketArn: webapp.s3Bucket.arn
	}
}

const apiRole = `arn:aws:iam::${AWS_ACCOUNT_ID()}:role/ggbot2_api_role`

// DeployStage main and next resources
const main = resources("main")
const next = resources("next")
// Cross deployStage resources
const cross = {
	// S3
	nakedDomainBucketArn: fqdn.urlShortenerDomain,
	// SES
	sesIdentityArn: getSesIdentityArn()
}

export const getDevopsPolicyName = () => "ggbot2-devops-policy"

export const getDevopsPolicyArn = () =>
	`arn:aws:iam::${AWS_ACCOUNT_ID()}:policy/${getDevopsPolicyName()}`

export const getDevopsPolicyStatements = () => [
	{
		Effect: "Allow",
		Action: [
			"ec2:DescribeAddresses",
			"elasticloadbalancing:DescribeLoadBalancers",
			"iam:GetPolicy",
			"logs:CreateLogGroup"
		],
		Resource: "*"
	},
	// iam:PassRole is needed by lambda:CreateFunction
	{
		Effect: "Allow",
		Action: ["iam:PassRole"],
		Resource: apiRole
	},
	{
		Effect: "Allow",
		Action: [
			"lambda:CreateFunction",
			"lambda:UpdateFunctionCode",
			"lambda:UpdateFunctionConfiguration"
		],
		Resource: lambdaAllArn
	},
	{
		Effect: "Allow",
		Action: ["s3:CreateBucket", "s3:GetBucketAcl", "s3:ListBucket"],
		Resource: [
			cross.nakedDomainBucketArn,
			main.dataBucketArn,
			// TODO main.logsBucketArn,
			main.webappBucketArn,
			next.dataBucketArn,
			// TODO next.logsBucketArn,
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
	Version,
	Statement: getDevopsPolicyStatements()
})

export const getSesNoreplyPolicyName = (deployStage = DEPLOY_STAGE()) =>
	`ggbot2-${deployStage}-ses-noreply-policy`

export const getSesNoreplyPolicyArn = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:iam::${AWS_ACCOUNT_ID()}:policy/${getSesNoreplyPolicyName(
		deployStage
	)}`

export const getSesNoreplyPolicyStatements = () => [
	{
		Effect: "Allow",
		Action: ["SES:SendEmail", "SES:SendRawEmail"],
		Resource: cross.sesIdentityArn
	}
]

export const getSesNoreplyPolicy = () => ({
	Version,
	Statement: getSesNoreplyPolicyStatements()
})
