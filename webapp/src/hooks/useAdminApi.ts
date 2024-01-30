import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import {
	AdminActionInput as Input,
	AdminActionOutput as Output,
	AdminActionType as ActionType
} from "@workspace/api"

const apiOptions: UseActionApiArg = {
	url: api.admin.action,
	withAuth: true
}

export const useAdminApi = {
	ListAccountKeys: () =>
		useAction<
			ActionType,
			Input["ListAccountKeys"],
			Output["ListAccountKeys"]
		>(apiOptions, "ListAccountKeys"),
	ReadAccount: () =>
		useAction<ActionType, Input["ReadAccount"], Output["ReadAccount"]>(
			apiOptions,
			"ReadAccount"
		)
}
