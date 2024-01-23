import {
	createdNow,
	CreationTime,
	EmailAccount,
	EmailAddress
} from "@workspace/models"

import { READ, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

type CreateEmailAccount = (
	arg: Omit<EmailAccount, "whenCreated">
) => Promise<CreationTime>

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

type ReadEmailAccount = (arg: EmailAddress) => Promise<EmailAccount | null>

export const readEmailAccount: ReadEmailAccount = (arg) =>
	READ<ReadEmailAccount>(pathname.emailAccount(arg))
