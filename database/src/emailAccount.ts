import {
	createdNow,
	CreateEmailAccount,
	EmailAccount,
	isEmailAccount,
	ReadEmailAccount
} from "@workspace/models"

import { READ, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const createEmailAccount: CreateEmailAccount = async ({
	accountId,
	email
}) => {
	const creationTime = createdNow()
	const data: EmailAccount = {
		accountId,
		email,
		...creationTime
	}
	await WRITE(pathname.emailAccount(email), data)
	return creationTime
}

export const readEmailAccount: ReadEmailAccount = (arg) =>
	READ<ReadEmailAccount>(isEmailAccount, pathname.emailAccount(arg))
