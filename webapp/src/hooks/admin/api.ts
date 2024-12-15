import { useAction, UseActionApiArg } from '_/hooks/useAction'
import { api } from '_/routing/api'
import { AdminClientActionInput as Input, AdminClientActionOutput as Output, AdminClientActionType as ActionType } from '@workspace/api'
import { Account } from '@workspace/models'

const apiOptions: UseActionApiArg = { url: api.admin, withAuth: true }

export function useEnterAsAccount() {
	return useAction<ActionType, Input['EnterAsAccount'], Output['EnterAsAccount']>(apiOptions, 'EnterAsAccount')
}

export function useListAccounts() {
	// TODO why this makes complain tsserver?
	// The inferred type of 'useListAccounts' cannot be named without a reference to '../../../../node_modules/@workspace/api/dist/documentProvider'. This is likely not portable. A type annotation is necessary.
	// return useAction<ActionType, Input["ListAccounts"], Output["ListAccounts"]>(apiOptions, "ListAccounts")
	return useAction<ActionType, Input['ListAccounts'], { accounts: Account[] }>(apiOptions, 'ListAccounts')
}

export function useReadAccountInfo() {
	return useAction<ActionType, Input['ReadAccountInfo'], Output['ReadAccountInfo']>(apiOptions, 'ReadAccountInfo')
}
