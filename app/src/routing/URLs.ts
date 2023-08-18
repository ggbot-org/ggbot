import {
	ApiBaseURL,
	ApiPurchaseOrderURL,
	ApiUserActionURL
} from "@ggbot2/locators"

const apiBase = new ApiBaseURL(DEPLOY_STAGE).toString()

export const url = {
	apiPurchaseOrder: new ApiPurchaseOrderURL(apiBase).toString(),
	apiUserAction: new ApiUserActionURL(apiBase).toString()
}
