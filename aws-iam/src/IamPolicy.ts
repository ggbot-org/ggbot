import { PolicyDocumentStatement } from "./types.js"

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
		Action: PolicyDocumentStatement<StatementAction>["Action"],
		Resource: PolicyDocumentStatement<StatementAction>["Resource"]
	): PolicyDocumentStatement<StatementAction> {
		return {
			Effect: "Allow", Action, Resource
		}
	}
}
