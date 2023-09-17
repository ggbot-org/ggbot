import { apiBase } from "_/routing/api"
import { ApiAdminActionURL } from "@workspace/locators"

export const url = {
	apiAdminAction: new ApiAdminActionURL(apiBase).toString()
}
