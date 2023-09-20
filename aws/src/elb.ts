import {
	DescribeLoadBalancersCommand,
	DescribeLoadBalancersCommandInput,
	DescribeLoadBalancersCommandOutput,
	ElasticLoadBalancingV2Client
} from "@aws-sdk/client-elastic-load-balancing-v2"

import { AwsClientConfigRegion } from "./region.js"

export type {
	ElasticLoadBalancingV2ServiceException,
	LoadBalancer
} from "@aws-sdk/client-elastic-load-balancing-v2"
export { LoadBalancerTypeEnum } from "@aws-sdk/client-elastic-load-balancing-v2"

type ElasticLoadBalancingV2ClientArgs = AwsClientConfigRegion

const elbClient = (args: ElasticLoadBalancingV2ClientArgs) =>
	new ElasticLoadBalancingV2Client(args)

export type DescribeLoadBalancersArgs = Required<
	Pick<DescribeLoadBalancersCommandInput, "Names">
>

export const describeLoadBalancers = async (
	clientArgs: ElasticLoadBalancingV2ClientArgs,
	commandArgs: DescribeLoadBalancersArgs
): Promise<DescribeLoadBalancersCommandOutput> => {
	const command = new DescribeLoadBalancersCommand(commandArgs)
	const client = elbClient(clientArgs)
	return await client.send(command)
}
