import { AwsResource } from "./AwsResource.js"

export type IamPolicy = AwsResource & {
	readonly policyName: string
}
