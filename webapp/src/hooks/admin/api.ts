import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import { AdminClientActionInput as Input, AdminClientActionOutput as Output, AdminClientActionType as ActionType } from "@workspace/api"

const apiOptions: UseActionApiArg = {
	url: api.admin.action,
	withAuth: true
}

export function useListAccountKeys() {
	return useAction<
		ActionType,
		Input["ListAccountKeys"],
		Output["ListAccountKeys"]
	>(apiOptions, "ListAccountKeys")
}

export function useReadAccountInfo() {
	return useAction<
		ActionType,
		Input["ReadAccountInfo"],
		Output["ReadAccountInfo"]
	>(apiOptions, "ReadAccountInfo")
}
