import { AwsResource } from "@workspace/aws-types"

const iamVersion = "2012-10-17"

export type { Policy } from "@aws-sdk/client-iam"

export type PolicyDocumentStatement<Action extends string> = {
	Action: Action[]
	Effect: "Allow"
	Resource: AwsResource["arn"] | Array<AwsResource["arn"]>
}

export type IamPolicyDocument<StatementName extends string, StatementAction extends string> = {
	readonly policyDocument: {
		Version: typeof iamVersion
		Statement: Array<PolicyDocumentStatement<StatementAction>>
	}
	readonly statementAction: Record<StatementName, PolicyDocumentStatement<StatementAction>["Action"]>
	readonly statementResource: Record<StatementName, PolicyDocumentStatement<StatementAction>["Resource"]>
}
