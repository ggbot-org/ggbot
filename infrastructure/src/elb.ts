import { LoadBalancerTypeEnum } from "@aws-sdk/client-elastic-load-balancing-v2";
import { getAwsAccountId, getDeployStage } from "@ggbot2/env";
import { awsRegion } from "./awsRegion.js";

const defaultDeployStage = getDeployStage();

export const getWebappLoadBalancerName = (deployStage = defaultDeployStage) =>
  `ggbot2-${deployStage}-webapp-lb`;

export const webappLoadBalancerType = LoadBalancerTypeEnum.APPLICATION;

export const getWebappLoadBalancerArnPrefix = (
  deployStage = defaultDeployStage
) => {
  const awsAccountId = getAwsAccountId();
  return `arn:aws:elasticloadbalancing:${awsRegion}:${awsAccountId}:loadbalancer/app/${getWebappLoadBalancerName(
    deployStage
  )}`;
};
