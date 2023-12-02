import {
	EmailAddress,
	isEmailAddress,
	isOneTimePasswordCode,
	OneTimePassword
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

type ApiAuthEnterRequestData = {
	email: EmailAddress
}

export const isApiAuthEnterRequestData =
	objectTypeGuard<ApiAuthEnterRequestData>(({ email }) =>
		isEmailAddress(email)
	)

export type ApiAuthEnterResponseData = {
	emailSent: boolean
}

export const isApiAuthEnterResponseData =
	objectTypeGuard<ApiAuthEnterResponseData>(
		({ emailSent }) => typeof emailSent === "boolean"
	)

type ApiAuthVerifyRequestData = Pick<OneTimePassword, "code"> & {
	email: EmailAddress
}

export const isApiAuthVerifyRequestData =
	objectTypeGuard<ApiAuthVerifyRequestData>(
		({ code, email }) =>
			isOneTimePasswordCode(code) && isEmailAddress(email)
	)

export type ApiAuthVerifyResponseData = {
	token?: string
}

export const isApiAuthVerifyResponseData =
	objectTypeGuard<ApiAuthVerifyResponseData>(({ token }) =>
		token === undefined ? true : typeof token === "string"
	)
