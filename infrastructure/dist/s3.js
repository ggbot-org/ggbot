import { getDeployStage } from "@ggbot2/env";
import { domainName } from "./domainNames.js";
export const dataBucketName = () => {
    const deployStage = getDeployStage();
    return `${deployStage}-data.${domainName}`;
};
