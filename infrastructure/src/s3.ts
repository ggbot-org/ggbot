import { getDeployStage } from "@ggbot2/env";
import { domainName } from "./domainNames.js";

const defaultDeployStage = getDeployStage();

export const getDataBucketName = (deployStage = defaultDeployStage) =>
  `${deployStage}-data.${domainName}`;

export const getDataBucketArn = (deployStage = defaultDeployStage) =>
  `arn:aws:s3:::${getDataBucketName(deployStage)}`;
