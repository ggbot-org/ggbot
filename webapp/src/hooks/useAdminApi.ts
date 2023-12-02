import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { url } from "_/routing/admin/URLs"
import { AdminApiActionType } from "@workspace/api"
import { ListAccountKeys, ReadAccount } from "@workspace/models"

const apiOptions: UseActionApiArg = {
	endpoint: url.apiAdminAction,
	withAuth: true
}

export const useAdminApi = {
	ListAccountKeys: () =>
		useAction<ListAccountKeys, AdminApiActionType>(
			apiOptions,
			"ListAccountKeys"
		),
	ReadAccount: () =>
		useAction<ReadAccount, AdminApiActionType>(apiOptions, "ReadAccount")
}
