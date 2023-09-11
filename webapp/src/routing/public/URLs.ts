import { ApiBaseURL, ApiPublicActionURL } from "@workspace/locators"

const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString()

export const url = {
	apiPublicAction: new ApiPublicActionURL(apiBase).toString()
}
