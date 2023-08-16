import {
	ApiAdminActionURL,
	ApiAuthenticationEnterURL,
	ApiAuthenticationVerifyURL,
	ApiBaseURL,
	ApiPublicActionURL
} from "@ggbot2/locators"

import { getDeployStage } from "./deployStage.js"

const DEPLOY_STAGE = getDeployStage()

let apiAdminAction = ""
let apiPublicAction = ""

let authenticationEnter = ""
let authenticationVerify = ""

if (DEPLOY_STAGE) {
	const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString()

	apiAdminAction = new ApiAdminActionURL(apiBase).toString()
	apiPublicAction = new ApiPublicActionURL(apiBase).toString()

	authenticationEnter = new ApiAuthenticationEnterURL(apiBase).toString()
	authenticationVerify = new ApiAuthenticationVerifyURL(apiBase).toString()
}

export const url = {
	apiAdminAction,
	apiPublicAction,
	authenticationEnter,
	authenticationVerify
}
