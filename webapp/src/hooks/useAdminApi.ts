import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	AdminAction as Action,
	AdminActionType as ActionType
} from "@workspace/api"

const apiOptions: UseActionApiArg = {
	endpoint: api.admin.action.href,
	withAuth: true
}

export const useAdminApi = {
	ListAccountKeys: () =>
		useAction<Action["ListAccountKeys"], ActionType>(
			apiOptions,
			"ListAccountKeys"
		),
	ReadAccount: () =>
		useAction<Action["ReadAccount"], ActionType>(apiOptions, "ReadAccount")
}
