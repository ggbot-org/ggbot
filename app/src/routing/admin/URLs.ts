import { ApiAdminActionURL, ApiBaseURL } from "@ggbot2/locators"

const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString()

export const url = {
	apiAdminAction: new ApiAdminActionURL(apiBase).toString()
}
