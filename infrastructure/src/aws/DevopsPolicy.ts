import { IamPolicy, IamPolicyDocument, PolicyDocumentStatement } from "@workspace/aws-iam"
import { S3Bucket } from "@workspace/aws-s3"
import { ENV } from "@workspace/env"

import { ApiRole } from "../aws/ApiRole.js"
import { LambdaFunction } from "../aws/LambdaFunction.js"
import { IamAction } from "./iamActions.js"
import { DataBucket, WebappBucket } from "./s3Buckets.js"

const statementNames = [
	"deployWebapp",
	"downloadDataBuckets",
	"manageLambdas",
	"manageLambdasPassRole",
	"manageLogGroups",
] as const
type StatementName = (typeof statementNames)[number]
type StatementAction = Extract<IamAction,
	| "iam:PassRole"
	| "lambda:CreateFunction"
	| "lambda:UpdateFunctionCode"
	| "lambda:UpdateFunctionConfiguration"
	| "logs:CreateLogGroup"
	| "logs:PutRetentionPolicy"
	| "s3:DeleteObject"
	| "s3:GetObject"
	| "s3:ListBucket"
	| "s3:PutObject"
>

function wholeBucket(bucket: S3Bucket) {
	return [bucket.arn, `${bucket.arn}/*`]
}
export class DevopsPolicy extends IamPolicy implements IamPolicyDocument<StatementName, StatementAction> {
	apiRole: ApiRole

	constructor() {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), `${ENV.PROJECT_SHORT_NAME()}-devops-policy`)

		this.apiRole = new ApiRole()
	}

	get statementAction(): Record<StatementName, PolicyDocumentStatement<StatementAction>["Action"]> {
		return {
			deployWebapp: [
				"s3:DeleteObject",
				"s3:ListBucket",
				"s3:PutObject",
			],
			downloadDataBuckets: [
				"s3:ListBucket",
				"s3:GetObject",
			],
			manageLambdas: [
				"lambda:CreateFunction",
				"lambda:UpdateFunctionCode",
				"lambda:UpdateFunctionConfiguration"
			],
			// iam:PassRole is needed by lambda:CreateFunction
			manageLambdasPassRole: [
				"iam:PassRole",
			],
			manageLogGroups: [
				"logs:CreateLogGroup",
				"logs:PutRetentionPolicy",
			],
		}
	}

	get statementResource(): Record<StatementName, PolicyDocumentStatement<StatementAction>["Resource"]> {
		return {
			deployWebapp: [
				...wholeBucket(new WebappBucket("main")),
				...wholeBucket(new WebappBucket("next")),
			],
			downloadDataBuckets: [
				...wholeBucket(new DataBucket("main")),
				...wholeBucket(new DataBucket("next")),
			],
			manageLambdas: LambdaFunction.everyArn(),
			manageLogGroups: "*",
			manageLambdasPassRole: this.apiRole.arn,
		}
	}

	get policyDocument(): IamPolicyDocument<StatementName, StatementAction>["policyDocument"] {
		return {
			Version: "2012-10-17",
			Statement: statementNames.map(
				(statementName) => IamPolicy.allowStatement(this.statementAction[statementName], this.statementResource[statementName])
			)
		}
	}
}
