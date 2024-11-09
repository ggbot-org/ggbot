export type PolicyDocumentStatement<Action extends string> = {
	Action: Action[]
	Effect: "Allow"
	Resource: string | Array<string>
}

export type IamPolicyDocument<StatementName extends string, StatementAction extends string> = {
	policyDocument: {
		Version: "2012-10-17"
		Statement: Array<PolicyDocumentStatement<StatementAction>>
	}
	statementAction: Record<StatementName, PolicyDocumentStatement<StatementAction>["Action"]>
	statementResource: Record<StatementName, PolicyDocumentStatement<StatementAction>["Resource"]>
}
