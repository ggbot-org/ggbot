import { useAction,UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import { AdminApiActionType } from "@workspace/api"
import { ListAccountKeys, ReadAccount } from "@workspace/models"

const apiOptions: UseActionApiArg = {
	endpoint: api.admin.action.href,
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
