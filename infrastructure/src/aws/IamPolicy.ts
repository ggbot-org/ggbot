export type IamPolicyDocumentStatement<Action extends string> = {
	Action: Action[]
	Effect: "Allow"
	Resource: string | Array<string>
}

export type IamPolicyDocument<StatementName extends string, StatementAction extends string> = {
	policyDocument: {
		Version: "2012-10-17"
		Statement: Array<IamPolicyDocumentStatement<StatementAction>>
	}
	statementAction: Record<StatementName, IamPolicyDocumentStatement<StatementAction>["Action"]>
	statementResource: Record<StatementName, IamPolicyDocumentStatement<StatementAction>["Resource"]>
}

export class IamPolicy {
	accountId: string
	region: string
	name: string

	constructor(accountId: string, region: string, name: string) {
		this.accountId = accountId
		this.region = region
		this.name = name
	}

	get arn() {
		return `arn:aws:iam::${this.accountId}:policy/${this.name}`
	}

	static allowStatement<StatementAction extends string>(
		Action: IamPolicyDocumentStatement<StatementAction>["Action"],
		Resource: IamPolicyDocumentStatement<StatementAction>["Resource"]
	): IamPolicyDocumentStatement<StatementAction> {
		return {
			Effect: "Allow", Action, Resource
		}
	}
}
