import {
	Account,
	EmailAccount,
	EmailAddress,
	isEmailAddress,
	isOneTimePasswordCode,
	OneTimePassword
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

type DatabaseAction = {
	CreateAccount: (arg: EmailAddress) => Promise<Account>
	CreateOneTimePassword: (arg: EmailAddress) => Promise<OneTimePassword>
	DeleteOneTimePassword: (arg: EmailAddress) => Promise<void>
	ReadEmailAccount: (arg: EmailAddress) => Promise<EmailAccount | null>
	ReadOneTimePassword: (arg: EmailAddress) => Promise<OneTimePassword | null>
}
export type AuthDatabaseAction = DatabaseAction
export type AuthDatabaseActionType = keyof DatabaseAction

type DatabaseInput = {
	CreateAccount: Parameters<DatabaseAction["CreateAccount"]>[0]
	CreateOneTimePassword: Parameters<
		DatabaseAction["CreateOneTimePassword"]
	>[0]
	DeleteOneTimePassword: Parameters<
		DatabaseAction["DeleteOneTimePassword"]
	>[0]
	ReadEmailAccount: Parameters<DatabaseAction["ReadEmailAccount"]>[0]
	ReadOneTimePassword: Parameters<DatabaseAction["ReadOneTimePassword"]>[0]
}
export type AuthDatabaseActionInput = DatabaseInput

export type AuthDatabaseActionOutput = {
	CreateAccount: Awaited<ReturnType<DatabaseAction["CreateAccount"]>>
	CreateOneTimePassword: Awaited<
		ReturnType<DatabaseAction["CreateOneTimePassword"]>
	>
	DeleteOneTimePassword: Awaited<
		ReturnType<DatabaseAction["DeleteOneTimePassword"]>
	>
	ReadEmailAccount: Awaited<ReturnType<DatabaseAction["ReadEmailAccount"]>>
	ReadOneTimePassword: Awaited<
		ReturnType<DatabaseAction["ReadOneTimePassword"]>
	>
}

export const isAuthDatabaseActionInput = {
	CreateAccount: isEmailAddress,
	CreateOneTimePassword: isEmailAddress,
	DeleteOneTimePassword: isEmailAddress,
	ReadEmailAccount: isEmailAddress,
	ReadOneTimePassword: isEmailAddress
}

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
