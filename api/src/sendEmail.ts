import { EmailAddress, Language, OneTimePassword, StrategyKey } from '@workspace/models'

import { Action } from './action.js'

type SendEmailCommonArgs = {
	email: EmailAddress
	language: Language
}

export type SendEmailAction = {
	SendOneTimePassword: Action<SendEmailCommonArgs & { oneTimePassword: OneTimePassword }, void>
	SuspendedStrategy: Action<SendEmailCommonArgs & StrategyKey, void>
}

export type SendEmailActionInput = {
	SendOneTimePassword: Parameters<SendEmailAction['SendOneTimePassword']>[0]
	SuspendedStrategy: Parameters<SendEmailAction['SuspendedStrategy']>[0]
}
