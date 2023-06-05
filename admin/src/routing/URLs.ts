import {
  ApiAdminActionURL,
  ApiAuthenticationEnterURL,
  ApiAuthenticationExitURL,
  ApiAuthenticationVerifyURL,
  ApiBaseURL,
} from "@ggbot2/locators";

import { getDeployStage } from "./deployStage.js";

const DEPLOY_STAGE = getDeployStage();

let apiAdminAction = "";
let authenticationEnter = "";
let authenticationExit = "";
let authenticationVerify = "";

if (DEPLOY_STAGE) {
  const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString();

  apiAdminAction = new ApiAdminActionURL(apiBase).toString();

  authenticationEnter = new ApiAuthenticationEnterURL(apiBase).toString();
  authenticationExit = new ApiAuthenticationExitURL(apiBase).toString();
  authenticationVerify = new ApiAuthenticationVerifyURL(apiBase).toString();
}

export const url = {
  apiAdminAction,
  authenticationEnter,
  authenticationExit,
  authenticationVerify,
};
