import {
	AwsAccountId,
	AwsRegion,
	LoadBalancer,
	LoadBalancerTypeEnum
} from "@workspace/aws"
import { ENV } from "@workspace/env"

export class BinanceProxyLoadBalancer extends LoadBalancer {
	static accountId: AwsAccountId = ENV.AWS_ACCOUNT_ID()
	static region: AwsRegion = ENV.AWS_BINANCE_PROXY_REGION()
	static loadBalancerType = LoadBalancerTypeEnum.APPLICATION

	constructor() {
		super(
			BinanceProxyLoadBalancer.accountId,
			BinanceProxyLoadBalancer.region,
			BinanceProxyLoadBalancer.loadBalancerType,
			BinanceProxyLoadBalancer.namespacedLoadBalancerName(
				"binance-proxy-230815-alb"
				// TODO "binance-proxy"
			)
		)
	}

	static namespacedLoadBalancerName(loadBalancerName: string) {
		return `${ENV.PROJECT_SHORT_NAME()}-${loadBalancerName}`
	}

	static everyArn() {
		return LoadBalancer.arn(
			BinanceProxyLoadBalancer.accountId,
			BinanceProxyLoadBalancer.region,
			"*"
		)
	}
}
