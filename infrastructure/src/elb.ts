import { LoadBalancerTypeEnum } from "@aws-sdk/client-elastic-load-balancing-v2";
import { getDeployStage } from "@ggbot2/env";
import { awsAccountId } from "./_env.js";
import { awsRegion } from "./awsRegion.js";

const defaultDeployStage = getDeployStage();

export const getWebappLoadBalancerName = (deployStage = defaultDeployStage) =>
  `ggbot2-${deployStage}-webapp-lb`;

export const webappLoadBalancerType = LoadBalancerTypeEnum.NETWORK;

export const getWebappLoadBalancerArnPrefix = (
  deployStage = defaultDeployStage
) =>
  `arn:aws:elasticloadbalancing:${awsRegion}:${awsAccountId}:loadbalancer/app/${getWebappLoadBalancerName(
    deployStage
  )}`;
