import { AwsAccountId, AwsRegion, AwsResource } from "@workspace/aws-types"

import { PolicyDocumentStatement } from "./types.js"

export class IamPolicy implements AwsResource {
	readonly accountId: AwsAccountId
	readonly region: AwsRegion

	readonly policyName: string

	constructor(accountId: AwsAccountId, region: AwsRegion, policyName: IamPolicy["policyName"]) {
		this.accountId = accountId
		this.region = region
		this.policyName = policyName
	}

	get arn() {
		return `arn:aws:iam::${this.accountId}:policy/${this.policyName}`
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
