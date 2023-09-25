import {
	GetPolicyCommand,
	GetPolicyCommandInput,
	GetPolicyCommandOutput,
	IAMClient
} from "@aws-sdk/client-iam"

export type { Tag } from "@aws-sdk/client-iam"

const iamClient = () => new IAMClient({})

export const getPolicy = async ({
	PolicyArn
}: Required<
	Pick<GetPolicyCommandInput, "PolicyArn">
>): Promise<GetPolicyCommandOutput> => {
	const command = new GetPolicyCommand({ PolicyArn })
	const client = iamClient()
	return await client.send(command)
}
