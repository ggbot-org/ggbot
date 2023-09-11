import {
	DescribeLoadBalancersCommand,
	DescribeLoadBalancersCommandInput,
	DescribeLoadBalancersCommandOutput,
	ElasticLoadBalancingV2Client
} from "@aws-sdk/client-elastic-load-balancing-v2"
import { awsRegion } from "@workspace/infrastructure"

export type {
	LoadBalancer,
	LoadBalancerTypeEnum
} from "@aws-sdk/client-elastic-load-balancing-v2"
export { ElasticLoadBalancingV2ServiceException } from "@aws-sdk/client-elastic-load-balancing-v2"

const client = new ElasticLoadBalancingV2Client({ region: awsRegion })

export type DescribeLoadBalancersArgs = Pick<
	DescribeLoadBalancersCommandInput,
	"Names"
>

export const describeLoadBalancers = async (
	args: DescribeLoadBalancersArgs
): Promise<DescribeLoadBalancersCommandOutput> => {
	const command = new DescribeLoadBalancersCommand(args)
	return await client.send(command)
}
