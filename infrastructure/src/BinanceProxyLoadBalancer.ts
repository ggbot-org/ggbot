import { AwsResource, LoadBalancerTypeEnum } from "@workspace/aws"
import { ENV } from "@workspace/env"

export class BinanceProxyLoadBalancer implements AwsResource {
	static arnPrefix = `arn:aws:elasticloadbalancing:${ENV.AWS_BINANCE_PROXY_REGION()}:${ENV.AWS_ACCOUNT_ID()}:loadbalancer/app`

	static loadBalancerType = LoadBalancerTypeEnum.APPLICATION

	loadBalancerName: string

	constructor(loadBalancerName: string) {
		this.loadBalancerName = loadBalancerName
	}

	get arn() {
		return BinanceProxyLoadBalancer.arn(this.loadBalancerName)
	}

	static arn(loadBalancerName: string) {
		return `${BinanceProxyLoadBalancer.arnPrefix}/${loadBalancerName}`
	}
}
