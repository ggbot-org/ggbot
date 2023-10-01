import {
	IamPolicy,
	PolicyDocumentStatement,
	PolicyDocumentStatementAction
} from "@workspace/aws"
import { ENV } from "@workspace/env"

import { ApiRole } from "./ApiRole.js"
import { staticWebsiteAwsRegion } from "./awsRegions.js"
import { BinanceProxyLoadBalancer } from "./BinanceProxyLoadBalancer.js"
import { LambdaFunction } from "./LambdaFunction.js"

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

	get readResourcesStatementActions(): PolicyDocumentStatementAction[] {
		return [
			"acm:ListCertificates",
			"ec2:DescribeAddresses",
			"iam:GetPolicy",
			"iam:GetPolicyVersion"
		]
	}

	get readResourcesStatement(): PolicyDocumentStatement {
		return {
			Effect: "Allow",
			Action: this.readResourcesStatementActions,
			Resource: "*"
		}
	}

	get binanceProxyStatement(): PolicyDocumentStatement {
		return {
			Effect: "Allow",
			Action: ["elasticloadbalancing:DescribeLoadBalancers"],
			Resource: BinanceProxyLoadBalancer.everyArn()
		}
	}

	get manageLambdasStatementActions(): PolicyDocumentStatementAction[] {
		return [
			"lambda:CreateFunction",
			"lambda:UpdateFunctionCode",
			"lambda:UpdateFunctionConfiguration"
		]
	}

	get manageLambdasStatementPassRoleAction(): PolicyDocumentStatementAction[] {
		// iam:PassRole is needed by lambda:CreateFunction
		return ["iam:PassRole"]
	}

	get manageLambdasStatements(): PolicyDocumentStatement[] {
		return [
			{
				Effect: "Allow",
				Action: this.manageLambdasStatementActions,
				Resource: `${LambdaFunction.everyArn()}`
			},
			{
				Effect: "Allow",
				Action: this.manageLambdasStatementPassRoleAction,
				Resource: this.apiRole.arn
			}
		]
	}

	get createBucketsStatementActions(): PolicyDocumentStatementAction[] {
		return ["s3:CreateBucket", "s3:GetBucketAcl", "s3:ListBucket"]
	}

	get createBucketsStatement() {
		return {
			Effect: "Allow",
			Action: this.createBucketsStatementActions,
			Resource: [
				// TODO
				// cross.nakedDomainBucketArn,
				// main.dataBucketArn,
				// main.webappBucketArn,
				// next.dataBucketArn,
				// next.webappBucketArn
			]
		}
	}

	get deployStaticWebsitesStatementActions(): PolicyDocumentStatementAction[] {
		return ["s3:DeleteObject", "s3:PutObject"]
	}

	get deployStaticWebsitesStatement() {
		return {
			Effect: "Allow",
			Action: this.deployStaticWebsitesStatementActions,
			Resource: [
				// TODO
				// main.webappBucketArn,
				// `${main.webappBucketArn}/*`,
				// next.webappBucketArn,
				// `${next.webappBucketArn}/*`
			]
		}
	}

	get statements() {
		return [
			this.readResourcesStatement,
			this.binanceProxyStatement,
			this.manageLambdasStatements,
			this.createBucketsStatement,
			this.deployStaticWebsitesStatement
		]
	}
}
