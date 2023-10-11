import { ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2"
import { AwsRegion } from "@workspace/aws-types"

export const elbClient = (region: AwsRegion) =>
	new ElasticLoadBalancingV2Client({ apiVersion: "2015-12-08", region })
