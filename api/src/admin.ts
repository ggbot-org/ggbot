import {
	Account,
	AccountInfo,
	AccountKey,
	isAccountKey,
} from '@workspace/models'
import { objectTypeGuard } from 'minimal-type-guard-helpers'

import { ActionTypes } from './action.js'
import {
	DocumentProviderListItemsInput,
	DocumentProviderListItemsOutput,
} from './documentProvider.js'

export type AdminDatabaseAction = {
	ListAccounts: (
		arg: Omit<DocumentProviderListItemsInput, 'prefix'>
	) => Promise<
		{ accounts: Account[] } & Omit<DocumentProviderListItemsOutput, 'keys'>
	>
	ReadAccountInfo: (arg: AccountKey) => Promise<AccountInfo | null>
}

export type AdminDatabaseActionInput = {
	ListAccounts: Parameters<AdminDatabaseAction['ListAccounts']>[0]
	ReadAccountInfo: Parameters<AdminDatabaseAction['ReadAccountInfo']>[0]
}

type AdminDatabaseActionOutput = {
	ListAccounts: Awaited<ReturnType<AdminDatabaseAction['ListAccounts']>>
	ReadAccountInfo: Awaited<ReturnType<AdminDatabaseAction['ReadAccountInfo']>>
}

type AdminClientAction = {
	EnterAsAccount: (arg: AccountKey) => Promise<{ token?: string }>
}

export type AdminClientActionType =
	| keyof AdminClientAction
	| keyof AdminDatabaseAction

export type AdminClientActionInput = AdminDatabaseActionInput & {
	EnterAsAccount: Parameters<AdminClientAction['EnterAsAccount']>[0]
}

export type AdminClientActionOutput = AdminDatabaseActionOutput & {
	EnterAsAccount: Awaited<ReturnType<AdminClientAction['EnterAsAccount']>>
}

export const isAdminClientActionInput = {
	EnterAsAccount: isAccountKey,
	ListAccounts: objectTypeGuard<AdminClientActionInput['ListAccounts']>(
		({ token, numItems }) =>
			(token === undefined || typeof token === 'string') &&
			(numItems === undefined || typeof numItems === 'number')
	),
	ReadAccount: isAccountKey,
}

export const adminClientActions: ActionTypes<AdminClientActionType> = [
	'ListAccounts',
	'ReadAccountInfo',
	'EnterAsAccount',
] as const
