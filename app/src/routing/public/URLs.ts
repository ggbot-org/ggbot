import { ApiBaseURL, ApiPublicActionURL } from "@ggbot2/locators"

const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString()

export const url = {
	apiPublicAction: new ApiPublicActionURL(apiBase).toString()
}
