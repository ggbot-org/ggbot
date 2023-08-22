import {
	// ListAccountKeys,
	ReadAccount
} from "@ggbot2/models"
import { AdminApiActionType } from "@workspace/api"

import { useAction } from "../hooks/useAction.js"
import { url } from "../routing/admin/URLs.js"

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
