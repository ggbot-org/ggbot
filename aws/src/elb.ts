import { ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2"

import { AwsRegion } from "./types.js"

export type { LoadBalancer as LoadBalancerDescription } from "@aws-sdk/client-elastic-load-balancing-v2"
export {
	LoadBalancerStateEnum,
	LoadBalancerTypeEnum
} from "@aws-sdk/client-elastic-load-balancing-v2"

export const elbClient = (region: AwsRegion) =>
	new ElasticLoadBalancingV2Client({ apiVersion: "2015-12-08", region })
