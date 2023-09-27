import {
	AwsRegion,
	AwsResource,
	getPolicy,
	getPolicyVersion,
	Policy,
	PolicyDocument
} from "@workspace/aws"
import { ENV } from "@workspace/env"

export class IamPolicy implements AwsResource {
	readonly policyName: string
	readonly region: AwsRegion
	policy: Policy | undefined
	policyDocument: PolicyDocument | undefined

	constructor(region: AwsRegion, policyName: IamPolicy["policyName"]) {
		this.region = region
		this.policyName = policyName
	}

	get arn() {
		return `arn:aws:iam::${ENV.AWS_ACCOUNT_ID()}:policy/${this.policyName}`
	}

	static parsePolicyVersionDocument(policyVersionDocument: string) {
		return JSON.parse(decodeURIComponent(policyVersionDocument))
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
		const result = await getPolicy(this.region, this.arn)
		return result.Policy
	}

	async readPolicyVersion(VersionId: string) {
		const result = await getPolicyVersion(this.region, {
			PolicyArn: this.arn,
			VersionId
		})
		return result.PolicyVersion
	}
}
