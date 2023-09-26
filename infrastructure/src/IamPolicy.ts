import { AwsRegion, AwsResource, getPolicy, Policy } from "@workspace/aws"
import { ENV } from "@workspace/env"

export class IamPolicy implements AwsResource {
	readonly policyName: string
	readonly region: AwsRegion

	constructor(region: AwsRegion, policyName: IamPolicy["policyName"]) {
		this.region = region
		this.policyName = policyName
	}

	get arn() {
		return `arn:aws:iam::${ENV.AWS_ACCOUNT_ID()}:policy/${this.policyName}`
	}

	async readPolicy(): Promise<Policy | undefined> {
		const result = await getPolicy(this.region, this.arn)
		return result.Policy
	}

	// TODO read policy version
	// async readPolicyVersion(versionId: string): Promise<Policy | undefined> {
	// 	const result = await getPolicyVersion(this.region, this.arn, versionId)
	// 	return result.Policy
	// }
}
