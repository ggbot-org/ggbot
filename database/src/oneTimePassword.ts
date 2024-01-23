import {
	DeletionTime,
	EmailAddress,
	generateOneTimePassword,
	OneTimePassword
} from "@workspace/models"

import { DELETE, READ, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

type CreateOneTimePassword = (arg: EmailAddress) => Promise<OneTimePassword>

export const createOneTimePassword: CreateOneTimePassword = async (email) => {
	const data = generateOneTimePassword()
	await WRITE(pathname.oneTimePassword(email), data)
	return data
}

type ReadOneTimePassword = (
	arg: EmailAddress
) => Promise<OneTimePassword | null>

export const readOneTimePassword: ReadOneTimePassword = async (email) =>
	await READ<ReadOneTimePassword>(pathname.oneTimePassword(email))

type DeleteOneTimePassword = (arg: EmailAddress) => Promise<DeletionTime>

export const deleteOneTimePassword: DeleteOneTimePassword = async (arg) =>
	await DELETE(pathname.oneTimePassword(arg))
