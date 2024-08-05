import { GetPolicyCommand, GetPolicyVersionCommand } from "@aws-sdk/client-iam"
import { AwsAccountId, AwsRegion, AwsResource } from "@workspace/aws-types"

import { iamClient } from "./client.js"
import { Policy, PolicyDocument, PolicyDocumentStatementAction } from "./types.js"

export class IamPolicy implements AwsResource {
	readonly accountId: AwsAccountId
	readonly region: AwsRegion

	readonly policyName: string
	policy: Policy | undefined
	policyDocument: PolicyDocument | undefined

	constructor(accountId: AwsAccountId, region: AwsRegion, policyName: IamPolicy["policyName"]) {
		this.accountId = accountId
		this.region = region
		this.policyName = policyName
	}

	get arn() {
		return `arn:aws:iam::${this.accountId}:policy/${this.policyName}`
	}

	static findPolicyDocumentStatementByActions({ Statement }: NonNullable<IamPolicy["policyDocument"]>) {
		return (
			policyDocumentStatementActions: PolicyDocumentStatementAction[]
		) => Statement.find(({ Action }) => Array.isArray(Action)
			? Action.slice().sort().join() === policyDocumentStatementActions.slice().sort().join()
			: Action === policyDocumentStatementActions[0]
		)
	}

	static parsePolicyVersionDocument(policyVersionDocument: string) {
		return JSON.parse(decodeURIComponent(policyVersionDocument)) as PolicyDocument
	}

	async read() {
		const policy = await this.readPolicy()
		this.policy = policy
		if (!policy) return
		const { DefaultVersionId } = policy
		if (!DefaultVersionId) return
		const policyVersion = await this.readPolicyVersion(DefaultVersionId)
		const policyVersionDocument = policyVersion?.Document
		if (!policyVersionDocument) return
		this.policyDocument = IamPolicy.parsePolicyVersionDocument(
			policyVersionDocument
		)
	}

	async readPolicy() {
		const command = new GetPolicyCommand({ PolicyArn: this.arn })
		const client = iamClient(this.region)
		const result = await client.send(command)
		return result.Policy
	}

	async readPolicyVersion(VersionId: string) {
		const command = new GetPolicyVersionCommand({
			PolicyArn: this.arn,
			VersionId
		})
		const client = iamClient(this.region)
		const result = await client.send(command)
		return result.PolicyVersion
	}
}
