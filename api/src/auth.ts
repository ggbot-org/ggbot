import { Account, EmailAccount, EmailAddress, isEmailAddress, isOneTimePasswordCode, OneTimePassword } from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

import { ActionTypes } from "./action.js"

export type AuthDatabaseAction = {
	CreateAccount: (arg: EmailAddress) => Promise<Account>
	CreateOneTimePassword: (arg: EmailAddress) => Promise<OneTimePassword>
	DeleteOneTimePassword: (arg: EmailAddress) => Promise<void>
	ReadEmailAccount: (arg: EmailAddress) => Promise<EmailAccount | null>
	ReadOneTimePassword: (arg: EmailAddress) => Promise<OneTimePassword | null>
}

export type AuthDatabaseActionInput = {
	CreateAccount: Parameters<AuthDatabaseAction["CreateAccount"]>[0]
	CreateOneTimePassword: Parameters<
		AuthDatabaseAction["CreateOneTimePassword"]
	>[0]
	DeleteOneTimePassword: Parameters<
		AuthDatabaseAction["DeleteOneTimePassword"]
	>[0]
	ReadEmailAccount: Parameters<AuthDatabaseAction["ReadEmailAccount"]>[0]
	ReadOneTimePassword: Parameters<
		AuthDatabaseAction["ReadOneTimePassword"]
	>[0]
}

export type AuthDatabaseActionOutput = {
	CreateAccount: Awaited<ReturnType<AuthDatabaseAction["CreateAccount"]>>
	CreateOneTimePassword: Awaited<
		ReturnType<AuthDatabaseAction["CreateOneTimePassword"]>
	>
	DeleteOneTimePassword: Awaited<
		ReturnType<AuthDatabaseAction["DeleteOneTimePassword"]>
	>
	ReadEmailAccount: Awaited<
		ReturnType<AuthDatabaseAction["ReadEmailAccount"]>
	>
	ReadOneTimePassword: Awaited<
		ReturnType<AuthDatabaseAction["ReadOneTimePassword"]>
	>
}

type AuthClientAction = {
	Enter: (arg: Pick<Account, "email">) => Promise<{ emailSent: boolean }>
	Verify: (
		arg: Pick<OneTimePassword, "code"> & { email: EmailAddress }
	) => Promise<{ token?: string }>
}

export type AuthClientActionType = keyof AuthClientAction

export const authClientActions: ActionTypes<AuthClientActionType> = [
	"Enter",
	"Verify"
] as const

type AuthClientInput = {
	Enter: Parameters<AuthClientAction["Enter"]>[0]
	Verify: Parameters<AuthClientAction["Verify"]>[0]
}

export type AuthClientActionOutput = {
	Enter: Awaited<ReturnType<AuthClientAction["Enter"]>>
	Verify: Awaited<ReturnType<AuthClientAction["Verify"]>>
}

export const isAuthClientActionInput = {
	Enter: objectTypeGuard<AuthClientInput["Enter"]>(({ email }) => isEmailAddress(email)
	),
	Verify: objectTypeGuard<AuthClientInput["Verify"]>(
		({ code, email }) => isOneTimePasswordCode(code) && isEmailAddress(email)
	)
}

type ApiAuthEnterRequestData = {
	email: EmailAddress
}

export const isApiAuthEnterRequestData = objectTypeGuard<ApiAuthEnterRequestData>(
	({ email }) => isEmailAddress(email)
)

type ApiAuthEnterResponseData = {
	emailSent: boolean
}

export const isApiAuthEnterResponseData = objectTypeGuard<ApiAuthEnterResponseData>(
	({ emailSent }) => typeof emailSent === "boolean"
)

type ApiAuthVerifyRequestData = Pick<OneTimePassword, "code"> & {
	email: EmailAddress
}

export const isApiAuthVerifyRequestData = objectTypeGuard<ApiAuthVerifyRequestData>(
	({ code, email }) => isOneTimePasswordCode(code) && isEmailAddress(email)
)

type ApiAuthVerifyResponseData = {
	token?: string
}

export const isApiAuthVerifyResponseData = objectTypeGuard<ApiAuthVerifyResponseData>(
	({ token }) => token === undefined ? true : typeof token === "string"
)
