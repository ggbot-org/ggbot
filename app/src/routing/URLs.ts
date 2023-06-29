import {
  ApiAuthenticationEnterURL,
  ApiAuthenticationExitURL,
  ApiAuthenticationVerifyURL,
  ApiBaseURL,
  ApiPublicActionURL,
  ApiPurchaseOrderURL,
  ApiUserActionURL,
} from "@ggbot2/locators";

import { getDeployStage } from "./deployStage.js";

const DEPLOY_STAGE = getDeployStage();

let apiPublicAction = "";

let apiPurchaseOrder = "";
let apiUserAction = "";

let authenticationEnter = "";
let authenticationExit = "";
let authenticationVerify = "";

if (DEPLOY_STAGE) {
  const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString();

  apiPurchaseOrder = new ApiPurchaseOrderURL(apiBase).toString();

  apiPublicAction = new ApiPublicActionURL(apiBase).toString();
  apiUserAction = new ApiUserActionURL(apiBase).toString();

  authenticationEnter = new ApiAuthenticationEnterURL(apiBase).toString();
  authenticationExit = new ApiAuthenticationExitURL(apiBase).toString();
  authenticationVerify = new ApiAuthenticationVerifyURL(apiBase).toString();
}

export const url = {
  apiPublicAction,
  apiPurchaseOrder,
  apiUserAction,
  authenticationEnter,
  authenticationExit,
  authenticationVerify,
};
