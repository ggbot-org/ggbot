import {
	ApiAuthenticationEnterURL,
	ApiAuthenticationVerifyURL,
	AuthBaseURL
} from "@workspace/locators"

const authBase = new AuthBaseURL(DEPLOY_STAGE).toString()

export const url = {
	authenticationEnter: new ApiAuthenticationEnterURL(authBase).toString(),
	authenticationVerify: new ApiAuthenticationVerifyURL(authBase).toString()
}
