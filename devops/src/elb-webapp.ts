import {
	getWebappLoadBalancerName,
	webappLoadBalancerType
} from "@workspace/infrastructure"

import { getLoadBalancerStatus, LoadBalancerStatus } from "./_elb.js"

const webappLoadBalancerName = getWebappLoadBalancerName()

export const getWebappLoadBalancerStatus =
	async (): Promise<LoadBalancerStatus> =>
		await getLoadBalancerStatus(
			{ Names: [webappLoadBalancerName] },
			{ wantedType: webappLoadBalancerType }
		)
