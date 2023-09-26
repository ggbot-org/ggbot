import { LoadBalancerTypeEnum } from "@workspace/aws"
import { ENV } from "@workspace/env"

import { staticWebsiteAwsRegion } from "./awsRegions.js"

const { AWS_ACCOUNT_ID, DEPLOY_STAGE } = ENV

const getWebappLoadBalancerName = (deployStage = DEPLOY_STAGE()) =>
	`ggbot2-${deployStage}-user-webapp-lb`

export const webappLoadBalancerType = LoadBalancerTypeEnum.APPLICATION

export const getWebappLoadBalancerArnPrefix = (deployStage = DEPLOY_STAGE()) =>
	`arn:aws:elasticloadbalancing:${staticWebsiteAwsRegion}:${AWS_ACCOUNT_ID()}:loadbalancer/app/${getWebappLoadBalancerName(
		deployStage
	)}`
