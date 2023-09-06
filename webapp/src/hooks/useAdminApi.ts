import { useAction } from "_/hooks/useAction.js"
import { url } from "_/routing/admin/URLs.js"
import {
	// ListAccountKeys,
	ReadAccount
} from "@ggbot2/models"
import { AdminApiActionType } from "@workspace/api"

const apiOptions = {
	endpoint: url.apiAdminAction,
	withJwt: true
}

export const useAdminApi = {
	// ListAccountKeys: () =>
	//   useAction<ListAccountKeys, AdminApiActionType>(
	//     apiOptions,
	//     "ListAccountKeys"
	//   ),
	ReadAccount: () =>
		useAction<ReadAccount, AdminApiActionType>(apiOptions, "ReadAccount")
}
