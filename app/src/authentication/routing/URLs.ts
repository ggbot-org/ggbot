import {
	ApiAuthenticationEnterURL,
	ApiAuthenticationVerifyURL,
	AuthBaseURL
} from "@ggbot2/locators"

const authBase = new AuthBaseURL(DEPLOY_STAGE).toString()

export const url = {
	authenticationEnter: new ApiAuthenticationEnterURL(authBase).toString(),
	authenticationVerify: new ApiAuthenticationVerifyURL(authBase).toString()
}
