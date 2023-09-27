import {
	PolicyDocumentStatement,
	PolicyDocumentStatementAction
} from "@workspace/aws"
import { ENV } from "@workspace/env"

import { ApiRole } from "./ApiRole.js"
import { staticWebsiteAwsRegion } from "./awsRegions.js"
import { BinanceProxyLoadBalancer } from "./BinanceProxyLoadBalancer.js"
import { IamPolicy } from "./IamPolicy.js"
import { LambdaFunction } from "./LambdaFunction.js"

export class DevopsPolicy extends IamPolicy {
	apiRole: ApiRole

	constructor() {
		super(
			staticWebsiteAwsRegion,
			// TODO `${ENV.PROJECT_SHORT_NAME()}-devops-policy`
			`${ENV.PROJECT_SHORT_NAME()}2-devops-policy`
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
			Resource: BinanceProxyLoadBalancer.arn("*")
		}
	}

	get manageLambdasStatements(): PolicyDocumentStatement[] {
		return [
			{
				Effect: "Allow",
				Action: [
					"lambda:CreateFunction",
					"lambda:UpdateFunctionCode",
					"lambda:UpdateFunctionConfiguration"
				],
				Resource: `${LambdaFunction.arn("*")}`
			},
			// iam:PassRole is needed by lambda:CreateFunction
			{
				Effect: "Allow",
				Action: ["iam:PassRole"],
				Resource: this.apiRole.arn
			}
		]
	}

	get createBucketsStatement() {
		return {
			Effect: "Allow",
			Action: ["s3:CreateBucket", "s3:GetBucketAcl", "s3:ListBucket"],
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

	get deployStaticWebsitesStatement() {
		return {
			Effect: "Allow",
			Action: ["s3:DeleteObject", "s3:PutObject"],
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
