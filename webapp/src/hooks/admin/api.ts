import { useAction, UseActionApiArg } from "_/hooks/useAction"
import { api } from "_/routing/api"
import { AdminClientActionInput as Input, AdminClientActionOutput as Output, AdminClientActionType as ActionType } from "@workspace/api"

const apiOptions: UseActionApiArg = {
	url: api.admin.action,
	withAuth: true
}

export function useEnterAsAccount() {
	return useAction<ActionType, Input["EnterAsAccount"], Output["EnterAsAccount"]>(apiOptions, "EnterAsAccount")
}

export function useListAccounts() {
	return useAction<ActionType, Input["ListAccounts"], Output["ListAccounts"]>(apiOptions, "ListAccounts")
}

export function useReadAccountInfo() {
	return useAction<ActionType, Input["ReadAccountInfo"], Output["ReadAccountInfo"]>(apiOptions, "ReadAccountInfo")
}
