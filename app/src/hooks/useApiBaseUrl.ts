import { ApiBaseURL } from "@ggbot2/locators";

import { useDeployStage } from "./useDeployStage.js";

export const useApiBaseURL = () => {
  const DEPLOY_STAGE = useDeployStage();
  if (!DEPLOY_STAGE) return;
  const apiBaseURL = new ApiBaseURL(DEPLOY_STAGE).toString();
  return apiBaseURL;
};
