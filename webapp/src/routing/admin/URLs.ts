import { ApiAdminActionURL, ApiBaseURL } from "@workspace/locators"

const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString()

export const url = {
	apiAdminAction: new ApiAdminActionURL(apiBase).toString()
}
