import {
	DescribeLoadBalancersCommand,
	ElasticLoadBalancingV2Client,
	LoadBalancerTypeEnum
} from "@aws-sdk/client-elastic-load-balancing-v2"

import { elbClient, LoadBalancerDescription } from "./elb.js"
import { ErrorCannotLoadBalancerDescription } from "./errors.js"
import { AwsAccountId, AwsRegion, AwsResource } from "./types.js"

export class LoadBalancer implements AwsResource {
	readonly accountId: AwsAccountId
	readonly region: AwsRegion

	readonly loadBalancerName: string
	readonly loadBalancerType: LoadBalancerTypeEnum
	readonly client: ElasticLoadBalancingV2Client

	constructor(
		accountId: AwsAccountId,
		region: AwsRegion,
		loadBalancerType: LoadBalancerTypeEnum,
		loadBalancerName: string
	) {
		this.accountId = accountId
		this.region = region
		this.loadBalancerType = loadBalancerType
		this.loadBalancerName = loadBalancerName
		this.client = elbClient(region)
	}

	get arn() {
		return LoadBalancer.arn(
			this.accountId,
			this.region,
			this.loadBalancerName
		)
	}

	static arn(
		accountId: AwsAccountId,
		region: AwsRegion,
		loadBalancerName: string
	) {
		const arnPrefix = `arn:aws:elasticloadbalancing:${region}:${accountId}:loadbalancer/app`
		return `${arnPrefix}/${loadBalancerName}`
	}

	async describe(): Promise<LoadBalancerDescription> {
		const command = new DescribeLoadBalancersCommand({
			Names: [this.loadBalancerName]
		})
		const { LoadBalancers } = await this.client.send(command)
		const result = LoadBalancers?.find(
			({ LoadBalancerName }) => LoadBalancerName === this.loadBalancerName
		)
		if (!result) throw new ErrorCannotLoadBalancerDescription()
		return result
	}
}
