import { AdminApiActionType } from "@ggbot2/api"
import {
	// ListAccountKeys,
	ReadAccount
} from "@ggbot2/models"
import { useAction } from "@ggbot2/use-action"

import { url } from "../routing/URLs.js"

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
