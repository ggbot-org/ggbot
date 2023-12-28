import {
	Account,
	AccountKey,
	CreateAccount,
	DeleteAccount,
	ErrorAccountItemNotFound,
	isAccountKey,
	ListAccountKeys,
	newAccount,
	ReadAccount,
	RenameAccount,
	SetAccountCountry,
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

export const createAccount: CreateAccount = async ({ email }) => {
	const account = newAccount({ email })
	const accountId = account.id
	await UPDATE(pathname.account({ accountId }), account)
	await createEmailAccount({ accountId, email })
	return account
}

export const readAccount: ReadAccount = (arg) =>
	READ<ReadAccount>(pathname.account(arg))

const readAccountOrThrow = async ({
	accountId
}: AccountKey): Promise<Account> => {
	const account = await readAccount({ accountId })
	if (!account)
		throw new ErrorAccountItemNotFound({ type: "Account", accountId })
	return account
}

export const listAccountKeys: ListAccountKeys = async () => {
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

export const renameAccount: RenameAccount = async ({ accountId, name }) => {
	throwIfInvalidName(name)
	const account = await readAccountOrThrow({ accountId })
	const data: Account = {
		...account,
		name
	}
	await UPDATE(pathname.account({ accountId }), data)
	return updatedNow()
}

export const setAccountCountry: SetAccountCountry = async ({
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

export const deleteAccount: DeleteAccount = (arg) =>
	DELETE(pathname.account(arg))
