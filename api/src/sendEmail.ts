import {
	EmailAddress,
	Language,
	OneTimePassword,
	StrategyKey
} from "@workspace/models"

import { Action } from "./action.js"

type SendEmailCommonArgs = {
	email: EmailAddress
	language: Language
}

export type SendEmailAction = {
	SendAllStrategiesSuspended: Action<SendEmailCommonArgs, void>
	SendOneTimePassword: Action<
		SendEmailCommonArgs & {
			oneTimePassword: OneTimePassword
		},
		void
	>
	SuspendedStrategy: Action<SendEmailCommonArgs & StrategyKey, void>
}

export type SendEmailActionInput = {
	SendAllStrategiesSuspended: Parameters<
		SendEmailAction["SendAllStrategiesSuspended"]
	>[0]
	SendOneTimePassword: Parameters<SendEmailAction["SendOneTimePassword"]>[0]
	SuspendedStrategy: Parameters<SendEmailAction["SuspendedStrategy"]>[0]
}
