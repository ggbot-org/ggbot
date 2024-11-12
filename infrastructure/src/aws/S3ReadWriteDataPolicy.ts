import { ENV } from "@workspace/env"

import { IamAction, IamPolicy, IamPolicyDocument, IamPolicyDocumentStatement } from "./IAM.js"
import { DataBucket, wholeBucket } from "./s3Buckets.js"

const statementNames = [
	"readWriteDataBucket",
] as const
type StatementName = (typeof statementNames)[number]
type StatementAction = Extract<IamAction,
	| "s3:DeleteObject"
	| "s3:GetObject"
	| "s3:ListBucket"
	| "s3:PutObject"
>

export class S3ReadWriteDataPolicy extends IamPolicy {
	constructor() {
		super(ENV.AWS_ACCOUNT_ID(), ENV.AWS_DATA_REGION(), `${ENV.PROJECT_SHORT_NAME()}-s3-readwrite-data-policy`)
	}

	get statementAction(): Record<StatementName, IamPolicyDocumentStatement<StatementAction>["Action"]> {
		return {
			readWriteDataBucket: [
				"s3:DeleteObject",
				"s3:GetObject",
				"s3:ListBucket",
				"s3:PutObject",
			],
		}
	}

	get statementResource(): Record<StatementName, IamPolicyDocumentStatement<StatementAction>["Resource"]> {
		return {
			readWriteDataBucket: [
				...wholeBucket(new DataBucket("main")),
				...wholeBucket(new DataBucket("next")),
			]
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

