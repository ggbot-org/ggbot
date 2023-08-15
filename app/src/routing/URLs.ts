import {
  ApiAuthenticationEnterURL,
  ApiAuthenticationVerifyURL,
  ApiBaseURL,
  ApiPublicActionURL,
  ApiPurchaseOrderURL,
  ApiUserActionURL,
  AuthBaseURL,
} from "@ggbot2/locators";

import { getDeployStage } from "./deployStage.js";

const DEPLOY_STAGE = getDeployStage();

let apiPublicAction = "";

let apiPurchaseOrder = "";
let apiUserAction = "";

let authenticationEnter = "";
let authenticationVerify = "";

if (DEPLOY_STAGE) {
  const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString();
  const authBase = new AuthBaseURL(DEPLOY_STAGE).toString();

  apiPurchaseOrder = new ApiPurchaseOrderURL(apiBase).toString();

  apiPublicAction = new ApiPublicActionURL(apiBase).toString();
  apiUserAction = new ApiUserActionURL(apiBase).toString();

  authenticationEnter = new ApiAuthenticationEnterURL(authBase).toString();
  authenticationVerify = new ApiAuthenticationVerifyURL(authBase).toString();
}

export const url = {
  apiPublicAction,
  apiPurchaseOrder,
  apiUserAction,
  authenticationEnter,
  authenticationVerify,
};
