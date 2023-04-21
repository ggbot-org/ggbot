import { LoadBalancerTypeEnum } from "@aws-sdk/client-elastic-load-balancing-v2";
import { ENV } from "@ggbot2/env";
import { awsRegion } from "./awsRegion.js";

const { AWS_ACCOUNT_ID, DEPLOY_STAGE } = ENV;

export const getWebappLoadBalancerName = (deployStage = DEPLOY_STAGE) =>
  `ggbot2-${deployStage}-user-webapp-lb`;

export const webappLoadBalancerType = LoadBalancerTypeEnum.APPLICATION;

export const getWebappLoadBalancerArnPrefix = (deployStage = DEPLOY_STAGE) => `arn:aws:elasticloadbalancing:${awsRegion}:${AWS_ACCOUNT_ID}:loadbalancer/app/${getWebappLoadBalancerName(
    deployStage
  )}`;
