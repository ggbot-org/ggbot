import { getDeployStage } from "@ggbot2/env";
import { domainName } from "./domainNames.js";
const deployStage = getDeployStage();
export const dataBucketName = `${deployStage}-data.${domainName}`;
export const dataBucketArn = `arn:aws:s3:::${dataBucketName}`;
