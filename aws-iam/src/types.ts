export type PolicyDocumentStatement<Action extends string> = {
	Action: Action[]
	Effect: "Allow"
	Resource: string | Array<string>
}

export type IamPolicyDocument<StatementName extends string, StatementAction extends string> = {
	readonly policyDocument: {
		Version: "2012-10-17"
		Statement: Array<PolicyDocumentStatement<StatementAction>>
	}
	readonly statementAction: Record<StatementName, PolicyDocumentStatement<StatementAction>["Action"]>
	readonly statementResource: Record<StatementName, PolicyDocumentStatement<StatementAction>["Resource"]>
}
