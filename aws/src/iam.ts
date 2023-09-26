import {
	GetPolicyCommand,
	GetPolicyCommandInput,
	GetPolicyCommandOutput,
	IAMClient
} from "@aws-sdk/client-iam"

import { AwsRegion } from "./region.js"

export type { Policy, Tag } from "@aws-sdk/client-iam"

export const iamVersion = "2012-10-17"

const iamClient = (region: AwsRegion) =>
	new IAMClient({ apiVersion: iamVersion, region })

export const getPolicy = async (
	region: AwsRegion,
	PolicyArn: NonNullable<GetPolicyCommandInput["PolicyArn"]>
): Promise<GetPolicyCommandOutput> => {
	const command = new GetPolicyCommand({ PolicyArn })
	const client = iamClient(region)
	return await client.send(command)
}
