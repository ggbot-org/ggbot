import {
  DescribeLoadBalancersCommand,
  ElasticLoadBalancingV2Client,
} from "@aws-sdk/client-elastic-load-balancing-v2";
import type {
  DescribeLoadBalancersCommandInput,
  DescribeLoadBalancersCommandOutput,
} from "@aws-sdk/client-elastic-load-balancing-v2";
import { awsRegion } from "@ggbot2/infrastructure";

export { ElasticLoadBalancingV2ServiceException } from "@aws-sdk/client-elastic-load-balancing-v2";
export type {
  LoadBalancer,
  LoadBalancerTypeEnum,
} from "@aws-sdk/client-elastic-load-balancing-v2";

const client = new ElasticLoadBalancingV2Client({ region: awsRegion });

export type DescribeLoadBalancersArgs = Pick<
  DescribeLoadBalancersCommandInput,
  "Names"
>;

export const describeLoadBalancers = async (
  args: DescribeLoadBalancersArgs
): Promise<DescribeLoadBalancersCommandOutput> => {
  const command = new DescribeLoadBalancersCommand(args);
  return await client.send(command);
};