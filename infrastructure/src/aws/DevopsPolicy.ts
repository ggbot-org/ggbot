import { IamPolicy, IamPolicyDocument, PolicyDocumentStatement } from "@workspace/aws-iam"
import { ENV } from "@workspace/env"

import { ApiRole } from "../aws/ApiRole.js"
import { LambdaFunction } from "../aws/LambdaFunction.js"
import { IamAction } from "./iamActions.js"
import { StaticWebsiteBucket } from "./StaticWebsiteBucket.js"

const statementNames = [
	"deployStaticWebsites",
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
	| "s3:ListBucket"
	| "s3:PutObject"
>

export class DevopsPolicy extends IamPolicy implements IamPolicyDocument<StatementName, StatementAction> {
	apiRole: ApiRole

	constructor() {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), `${ENV.PROJECT_SHORT_NAME()}-devops-policy`)

		this.apiRole = new ApiRole()
	}

	get statementAction(): Record<StatementName, PolicyDocumentStatement<StatementAction>["Action"]> {
		return {
			deployStaticWebsites: [
				"s3:DeleteObject",
				"s3:ListBucket",
				"s3:PutObject",
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
		const mainWebappBucket = new StaticWebsiteBucket("main")
		const nextWebappBucket = new StaticWebsiteBucket("next")
		return {
			deployStaticWebsites: [
				mainWebappBucket.arn,
				`${mainWebappBucket.arn}/*`,
				nextWebappBucket.arn,
				`${nextWebappBucket.arn}/*`,
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
