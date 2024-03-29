import { IamPolicy, PolicyDocumentStatement } from "@workspace/aws-iam"
import { ENV } from "@workspace/env"

import { ApiRole } from "./ApiRole.js"
import { staticWebsiteAwsRegion } from "./awsRegions.js"
import { LambdaFunction } from "./LambdaFunction.js"
import { WebappApiGatewayDomain } from "./WebappApiGatewayDomain.js"

const statementNames = [
	"createBuckets",
	"deployStaticWebsites",
	"manageLambdas",
	"manageLambdasPassRole",
	"manageLogGroups",
	"readResources",
	"webappApiGatewayDomain"
] as const
type DevopsPolicyStatementName = (typeof statementNames)[number]

export class DevopsPolicy extends IamPolicy {
	apiRole: ApiRole

	constructor() {
		super(
			ENV.AWS_ACCOUNT_ID(),
			staticWebsiteAwsRegion,
			`${ENV.PROJECT_SHORT_NAME()}-devops-policy`
		)

		this.apiRole = new ApiRole()
	}

	get statementAction(): Record<
		DevopsPolicyStatementName,
		PolicyDocumentStatement["Action"]
	> {
		return {
			createBuckets: [
				"s3:CreateBucket",
				"s3:GetBucketAcl",
				"s3:ListBucket"
			],
			deployStaticWebsites: ["s3:DeleteObject", "s3:PutObject"],
			manageLambdas: [
				"lambda:CreateFunction",
				"lambda:UpdateFunctionCode",
				"lambda:UpdateFunctionConfiguration"
			],
			// iam:PassRole is needed by lambda:CreateFunction
			manageLambdasPassRole: ["iam:PassRole"],
			manageLogGroups: ["logs:CreateLogGroup", "logs:PutRetentionPolicy"],
			readResources: [
				"acm:ListCertificates",
				"ec2:DescribeAddresses",
				"iam:GetPolicy",
				"iam:GetPolicyVersion"
			],
			webappApiGatewayDomain: ["apigateway:GET"]
		}
	}

	get statementResource(): Record<
		DevopsPolicyStatementName,
		PolicyDocumentStatement["Resource"]
	> {
		return {
			createBuckets: [
				// TODO
				// cross.nakedDomainBucketArn,
				// main.dataBucketArn,
				// main.webappBucketArn,
				// next.dataBucketArn,
				// next.webappBucketArn
			],
			deployStaticWebsites: [
				// TODO
				// main.webappBucketArn,
				// `${main.webappBucketArn}/*`,
				// next.webappBucketArn,
				// `${next.webappBucketArn}/*`
			],
			manageLambdas: LambdaFunction.everyArn(),
			manageLogGroups: "*",
			manageLambdasPassRole: this.apiRole.arn,
			readResources: "*",
			webappApiGatewayDomain: WebappApiGatewayDomain.everyArn()
		}
	}

	get statement(): Record<
		DevopsPolicyStatementName,
		PolicyDocumentStatement
	> {
		const allow = (
			statementName: DevopsPolicyStatementName
		): PolicyDocumentStatement => ({
			Effect: "Allow",
			Action: this.statementAction[statementName],
			Resource: this.statementAction[statementName]
		})

		return {
			createBuckets: allow("createBuckets"),
			deployStaticWebsites: allow("deployStaticWebsites"),
			manageLambdas: allow("manageLambdas"),
			manageLogGroups: allow("manageLogGroups"),
			manageLambdasPassRole: allow("manageLambdasPassRole"),
			readResources: allow("readResources"),
			webappApiGatewayDomain: allow("webappApiGatewayDomain")
		}
	}
}
