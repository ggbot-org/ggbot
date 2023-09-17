import { apiBase } from "_/routing/api"
import { ApiPurchaseOrderURL, ApiUserActionURL } from "@workspace/locators"

export const url = {
	apiPurchaseOrder: new ApiPurchaseOrderURL(apiBase).toString(),
	apiUserAction: new ApiUserActionURL(apiBase).toString()
}
