import {
	DescribeLoadBalancersCommand,
	DescribeLoadBalancersCommandInput,
	DescribeLoadBalancersCommandOutput,
	ElasticLoadBalancingV2Client
} from "@aws-sdk/client-elastic-load-balancing-v2"

import { AwsRegion } from "./region.js"

export type {
	ElasticLoadBalancingV2ServiceException,
	LoadBalancer
} from "@aws-sdk/client-elastic-load-balancing-v2"
export { LoadBalancerTypeEnum } from "@aws-sdk/client-elastic-load-balancing-v2"

const elbClient = (region: AwsRegion) =>
	new ElasticLoadBalancingV2Client({ apiVersion: "2015-12-08", region })

export const describeLoadBalancers = async (
	region: AwsRegion,
	{ Names }: Required<Pick<DescribeLoadBalancersCommandInput, "Names">>
): Promise<DescribeLoadBalancersCommandOutput> => {
	const command = new DescribeLoadBalancersCommand({ Names })
	const client = elbClient(region)
	return await client.send(command)
}
