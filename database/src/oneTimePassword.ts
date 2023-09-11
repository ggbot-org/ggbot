import { sendEmail } from "@workspace/aws"
import { oneTimePasswordEmailMessage } from "@workspace/email-messages"
import { noReplyEmailAddress } from "@workspace/locators"
import {
	createdNow,
	CreateOneTimePassword,
	deletedNow,
	DeleteOneTimePassword,
	generateOneTimePassword,
	isOneTimePassword,
	ReadOneTimePassword,
	SendOneTimePassword
} from "@workspace/models"
import { isTestAccountEmail, testOtp } from "@workspace/test-data"

import { DELETE, READ, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const createOneTimePassword: CreateOneTimePassword = async (email) => {
	if (isTestAccountEmail(email)) return testOtp
	const data = generateOneTimePassword()
	await WRITE(pathname.oneTimePassword(email), data)
	return data
}

export const readOneTimePassword: ReadOneTimePassword = async (email) => {
	if (isTestAccountEmail(email)) return testOtp
	return await READ<ReadOneTimePassword>(
		isOneTimePassword,
		pathname.oneTimePassword(email)
	)
}

export const deleteOneTimePassword: DeleteOneTimePassword = async (arg) => {
	if (isTestAccountEmail(arg)) return deletedNow()
	return await DELETE(pathname.oneTimePassword(arg))
}

export const sendOneTimePassword: SendOneTimePassword = async ({
	language,
	email,
	oneTimePassword
}) => {
	const whenCreated = createdNow()
	if (isTestAccountEmail(email)) return whenCreated
	const emailMessage = oneTimePasswordEmailMessage(language, {
		oneTimePassword
	})
	await sendEmail({
		source: noReplyEmailAddress,
		toAddresses: [email],
		...emailMessage
	})
	return whenCreated
}
