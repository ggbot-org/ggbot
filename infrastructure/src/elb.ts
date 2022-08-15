import { LoadBalancerTypeEnum } from "@aws-sdk/client-elastic-load-balancing-v2";
import { getAwsAccountId, getDeployStage } from "@ggbot2/env";
import { awsRegion } from "./awsRegion.js";
import { projectName } from "./projectName.js";

const awsAccountId = getAwsAccountId();
const defaultDeployStage = getDeployStage();

export const getWebappLoadBalancerName = (deployStage = defaultDeployStage) =>
  `${projectName}-${deployStage}-webapp-lb`;

export const webappLoadBalancerType = LoadBalancerTypeEnum.APPLICATION;

export const getWorkerLoadBalancerName = (deployStage = defaultDeployStage) =>
  `${projectName}-${deployStage}-worker-lb`;

export const workerLoadBalancerType = LoadBalancerTypeEnum.NETWORK;

export const getWorkerLoadBalancerArnPrefix = (
  deployStage = defaultDeployStage
) =>
  `arn:aws:elasticloadbalancing:${awsRegion}:${awsAccountId}:loadbalancer/app/${getWorkerLoadBalancerName(
    deployStage
  )}`;
