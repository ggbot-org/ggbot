import {
	EmailAddress,
	isEmailAddress,
	isOneTimePasswordCode,
	OneTimePassword
} from "@workspace/models"
import {
	isNonEmptyString,
	NonEmptyString,
	objectTypeGuard
} from "@workspace/type-utils"

export type ApiAuthEnterRequestData = {
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

export type ApiAuthVerifyRequestData = Pick<OneTimePassword, "code"> & {
	email: EmailAddress
}

export const isApiAuthVerifyRequestData =
	objectTypeGuard<ApiAuthVerifyRequestData>(
		({ code, email }) =>
			isOneTimePasswordCode(code) && isEmailAddress(email)
	)

export type ApiAuthVerifyResponseData = {
	jwt?: NonEmptyString
}

export const isApiAuthVerifyResponseData =
	objectTypeGuard<ApiAuthVerifyResponseData>(({ jwt }) => {
		if (jwt === undefined) return true
		return isNonEmptyString(jwt)
	})

export type ApiAuthVerifyResponse = {
	data: ApiAuthVerifyResponseData
}

export const isApiAuthVerifyResponse = objectTypeGuard<ApiAuthVerifyResponse>(
	({ data }) => isApiAuthEnterResponseData(data)
)
