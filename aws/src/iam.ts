import {
	GetPolicyCommand,
	GetPolicyCommandInput,
	GetPolicyCommandOutput,
	IAMClient
} from "@aws-sdk/client-iam"

export type { Tag } from "@aws-sdk/client-iam"

const iamClient = () => new IAMClient({})

export type GetPolicyArgs = Required<Pick<GetPolicyCommandInput, "PolicyArn">>

export const getPolicy = async (
	commandArgs: GetPolicyArgs
): Promise<GetPolicyCommandOutput> => {
	const command = new GetPolicyCommand(commandArgs)
	const client = iamClient()
	return await client.send(command)
}
