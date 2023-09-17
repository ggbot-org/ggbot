import { apiBase } from "_/routing/api"
import { ApiPublicActionURL } from "@workspace/locators"

export const url = {
	apiPublicAction: new ApiPublicActionURL(apiBase).toString()
}
