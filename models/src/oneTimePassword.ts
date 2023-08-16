import { objectTypeGuard } from "@ggbot2/type-utils"

import { EmailAddress } from "./email.js"
import { Language } from "./languages.js"
import {
	createdNow,
	CreationTime,
	DeletionTime,
	isCreationTime
} from "./time.js"

type OneTimePasswordCode = string

export const oneTimePasswordCodeLength = 6

export const isOneTimePasswordCode = (
	arg: unknown
): arg is OneTimePasswordCode =>
	typeof arg === "string" && arg.length === oneTimePasswordCodeLength

export type OneTimePassword = CreationTime & {
	code: OneTimePasswordCode
}

export const isOneTimePassword = objectTypeGuard<OneTimePassword>(
	({ code, ...creationTime }) =>
		isOneTimePasswordCode(code) && isCreationTime(creationTime)
)

export const generateOneTimePassword = (): OneTimePassword => {
	const chars = []
	while (chars.length < oneTimePasswordCodeLength)
		chars.push(String(Math.floor(Math.random() * 10)))
	return { code: chars.join(""), ...createdNow() }
}

export type CreateOneTimePassword = (
	arg: EmailAddress
) => Promise<OneTimePassword>

export type ReadOneTimePassword = (
	arg: EmailAddress
) => Promise<OneTimePassword | null>

export type DeleteOneTimePassword = (arg: EmailAddress) => Promise<DeletionTime>

export type SendOneTimePasswordInput = {
	email: EmailAddress
	oneTimePassword: OneTimePassword
	language: Language
}

export type SendOneTimePassword = (
	arg: SendOneTimePasswordInput
) => Promise<CreationTime>
