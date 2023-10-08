import { apiBase } from "_/routing/api"
import { ApiUserActionURL, ApiUtrustOrderURL } from "@workspace/locators"

export const url = {
	apiUtrustOrder: new ApiUtrustOrderURL(apiBase).toString(),
	apiUserAction: new ApiUserActionURL(apiBase).toString()
}
