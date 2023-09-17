import { authBase } from "_/routing/api"
import {
	ApiAuthenticationEnterURL,
	ApiAuthenticationVerifyURL
} from "@workspace/locators"

export const url = {
	authenticationEnter: new ApiAuthenticationEnterURL(authBase).toString(),
	authenticationVerify: new ApiAuthenticationVerifyURL(authBase).toString()
}
