import {
	AdminApiDataProviderOperation as AdminOperation,
	UserApiDataProviderOperation as UserOperation
} from "@workspace/api"
import {
	Account,
	AccountKey,
	ErrorAccountItemNotFound,
	isAccountKey,
	newAccount,
	throwIfInvalidName,
	updatedNow
} from "@workspace/models"

import { DELETE, LIST, READ, UPDATE } from "./_dataBucket.js"
import { createEmailAccount } from "./emailAccount.js"
import {
	dirnameDelimiter,
	dirnamePrefix,
	locatorToItemKey,
	pathname
} from "./locators.js"

type CreateAccount = (arg: Pick<Account, "email">) => Promise<Account>

export const createAccount: CreateAccount = async ({ email }) => {
	const account = newAccount({ email })
	const accountId = account.id
	await UPDATE(pathname.account({ accountId }), account)
	await createEmailAccount({ accountId, email })
	return account
}

// TODO consider removing this, at least it is not ad AdminOperation
// Admin API should be a superset of UserApi
export const readAccount: AdminOperation["ReadAccount"] = (arg) =>
	READ<AdminOperation["ReadAccount"]>(pathname.account(arg))

type ReadAccountOrThrow = (arg: AccountKey) => Promise<Account>

const readAccountOrThrow: ReadAccountOrThrow = async ({ accountId }) => {
	const account = await readAccount({ accountId })
	if (!account)
		throw new ErrorAccountItemNotFound({ type: "Account", accountId })
	return account
}

export const listAccountKeys: AdminOperation["ListAccountKeys"] = async () => {
	const Prefix = dirnamePrefix.account + dirnameDelimiter
	const results = await LIST({
		Prefix
	})
	if (!Array.isArray(results.Contents)) return Promise.resolve([])
	return (
		results.Contents.reduce<AccountKey[]>((list, { Key }) => {
			if (typeof Key !== "string") return list
			const itemKey = locatorToItemKey.account(Key)
			return isAccountKey(itemKey) ? list.concat(itemKey) : list
		}, []) ?? []
	)
}

export const renameAccount: UserOperation["RenameAccount"] = async ({
	accountId,
	name
}) => {
	throwIfInvalidName(name)
	const account = await readAccountOrThrow({ accountId })
	const data: Account = {
		...account,
		name
	}
	await UPDATE(pathname.account({ accountId }), data)
	return updatedNow()
}

export const setAccountCountry: UserOperation["SetAccountCountry"] = async ({
	accountId,
	country
}) => {
	const account = await readAccountOrThrow({ accountId })
	const data: Account = {
		...account,
		country
	}
	await UPDATE(pathname.account({ accountId }), data)
	return updatedNow()
}

export const deleteAccount: UserOperation["DeleteAccount"] = (arg) =>
	DELETE(pathname.account(arg))
