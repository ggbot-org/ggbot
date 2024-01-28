import {
	Account,
	EmailAccount,
	EmailAddress,
	isEmailAddress,
	isOneTimePasswordCode,
	OneTimePassword
} from "@workspace/models"
import { objectTypeGuard } from "minimal-type-guard-helpers"

type Action = {
	CreateAccount: (arg: EmailAddress) => Promise<Account>
	CreateOneTimePassword: (arg: EmailAddress) => Promise<OneTimePassword>
	DeleteOneTimePassword: (arg: EmailAddress) => Promise<void>
	ReadEmailAccount: (arg: EmailAddress) => Promise<EmailAccount | null>
	ReadOneTimePassword: (arg: EmailAddress) => Promise<OneTimePassword | null>
}
export type AuthAction = Action
export type AuthActionType = keyof Action

type Input = {
	CreateAccount: Parameters<Action["CreateAccount"]>[0]
	CreateOneTimePassword: Parameters<Action["CreateOneTimePassword"]>[0]
	DeleteOneTimePassword: Parameters<Action["DeleteOneTimePassword"]>[0]
	ReadEmailAccount: Parameters<Action["ReadEmailAccount"]>[0]
	ReadOneTimePassword: Parameters<Action["ReadOneTimePassword"]>[0]
}
export type AuthActionInput = Input

export type AuthActionOutput = {
	CreateAccount: Awaited<ReturnType<Action["CreateAccount"]>>
	CreateOneTimePassword: Awaited<ReturnType<Action["CreateOneTimePassword"]>>
	DeleteOneTimePassword: Awaited<ReturnType<Action["DeleteOneTimePassword"]>>
	ReadEmailAccount: Awaited<ReturnType<Action["ReadEmailAccount"]>>
	ReadOneTimePassword: Awaited<ReturnType<Action["ReadOneTimePassword"]>>
}

type ClientAction = {
	Enter: (arg: Pick<Account, "email">) => Promise<{ emailSent: boolean }>
}
export type AuthClientActionType = keyof ClientAction

type ClientInput = {
	Enter: Parameters<ClientAction["Enter"]>[0]
}

export type AuthClientOutput = {
	Enter: Awaited<ReturnType<ClientAction["Enter"]>>
}

export const isAuthClientActionInput = {
	Enter: objectTypeGuard<ClientInput["Enter"]>(({ email }) =>
		isEmailAddress(email)
	)
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
