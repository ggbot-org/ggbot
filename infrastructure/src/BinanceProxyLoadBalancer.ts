import { LoadBalancerTypeEnum } from "@workspace/aws"
import { ENV } from "@workspace/env"

export class BinanceProxyLoadBalancer {
	static arnPrefix = `arn:aws:elasticloadbalancing:${ENV.AWS_BINANCE_PROXY_REGION()}:${ENV.AWS_ACCOUNT_ID()}:loadbalancer/app`

	static loadBalancerType = LoadBalancerTypeEnum.APPLICATION

	static arn(loadBalancerName: string) {
		return `${BinanceProxyLoadBalancer.arnPrefix}/${loadBalancerName}`
	}
}
