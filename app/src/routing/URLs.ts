import {
  ApiAuthenticationEnterURL,
  ApiAuthenticationExitURL,
  ApiAuthenticationVerifyURL,
  ApiBaseURL,
  ApiPurchaseOrderURL,
  ApiUserActionURL,
} from "@ggbot2/locators";

import { getDeployStage } from "./deployStage.js";

const DEPLOY_STAGE = getDeployStage();

let apiUserAction = "";
let apiPurchaseOrder = "";
let authenticationEnter = "";
let authenticationExit = "";
let authenticationVerify = "";

if (DEPLOY_STAGE) {
  const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString();

  apiUserAction = new ApiUserActionURL(apiBase).toString();
  apiPurchaseOrder = new ApiPurchaseOrderURL(apiBase).toString();

  authenticationEnter = new ApiAuthenticationEnterURL(apiBase).toString();
  authenticationExit = new ApiAuthenticationExitURL(apiBase).toString();
  authenticationVerify = new ApiAuthenticationVerifyURL(apiBase).toString();
}

export const url = {
  apiPurchaseOrder,
  apiUserAction,
  authenticationEnter,
  authenticationExit,
  authenticationVerify,
};
