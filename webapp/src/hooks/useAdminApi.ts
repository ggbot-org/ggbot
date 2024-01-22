import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	AdminApiActionType as ActionType,
	ListAccountKeys,
	ReadAccount
} from "@workspace/api"

const apiOptions: UseActionApiArg = {
	endpoint: api.admin.action.href,
	withAuth: true
}

export const useAdminApi = {
	ListAccountKeys: () =>
		useAction<ListAccountKeys, ActionType>(apiOptions, "ListAccountKeys"),
	ReadAccount: () =>
		useAction<ReadAccount, ActionType>(apiOptions, "ReadAccount")
}
