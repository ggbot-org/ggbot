import { sendEmail } from "@workspace/aws"
import { oneTimePasswordEmailMessage } from "@workspace/email-messages"
import { ENV } from "@workspace/env"
import { noReplyEmailAddress } from "@workspace/locators"
import {
	createdNow,
	CreateOneTimePassword,
	DeleteOneTimePassword,
	generateOneTimePassword,
	isOneTimePassword,
	ReadOneTimePassword,
	SendOneTimePassword
} from "@workspace/models"

import { DELETE, READ, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const createOneTimePassword: CreateOneTimePassword = async (email) => {
	const data = generateOneTimePassword()
	await WRITE(pathname.oneTimePassword(email), data)
	return data
}

export const readOneTimePassword: ReadOneTimePassword = async (email) =>
	await READ<ReadOneTimePassword>(
		isOneTimePassword,
		pathname.oneTimePassword(email)
	)

export const deleteOneTimePassword: DeleteOneTimePassword = async (arg) =>
	await DELETE(pathname.oneTimePassword(arg))

export const sendOneTimePassword: SendOneTimePassword = async ({
	language,
	email,
	oneTimePassword
}) => {
	const whenCreated = createdNow()
	const emailMessage = oneTimePasswordEmailMessage(language, {
		oneTimePassword
	})
	await sendEmail({
		source: noReplyEmailAddress(ENV.DNS_DOMAIN()),
		toAddresses: [email],
		...emailMessage
	})
	return whenCreated
}
