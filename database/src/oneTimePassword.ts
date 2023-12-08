import {
	CreateOneTimePassword,
	DeleteOneTimePassword,
	generateOneTimePassword,
	ReadOneTimePassword
} from "@workspace/models"

import { DELETE, READ, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const createOneTimePassword: CreateOneTimePassword = async (email) => {
	const data = generateOneTimePassword()
	await WRITE(pathname.oneTimePassword(email), data)
	return data
}

export const readOneTimePassword: ReadOneTimePassword = async (email) =>
	await READ<ReadOneTimePassword>(pathname.oneTimePassword(email))

export const deleteOneTimePassword: DeleteOneTimePassword = async (arg) =>
	await DELETE(pathname.oneTimePassword(arg))
