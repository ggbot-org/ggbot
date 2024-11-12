import { objectTypeGuard } from 'minimal-type-guard-helpers'

import { createdNow, CreationTime, isCreationTime } from './time.js'

type OneTimePasswordCode = string

const oneTimePasswordCodeLength = 6

export const isOneTimePasswordCode = (
	arg: unknown
): arg is OneTimePasswordCode => typeof arg === 'string' && arg.length === oneTimePasswordCodeLength

export type OneTimePassword = CreationTime & {
	code: OneTimePasswordCode
}

export const isOneTimePassword = objectTypeGuard<OneTimePassword>(
	({ code, ...creationTime }) => isOneTimePasswordCode(code) && isCreationTime(creationTime)
)

export function generateOneTimePassword(): OneTimePassword {
	const chars = []
	while (chars.length < oneTimePasswordCodeLength) chars.push(String(Math.floor(Math.random() * 10)))
	return { code: chars.join(''), ...createdNow() }
}
