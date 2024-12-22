import { createdNow, CreationTime } from './time.js'

type OneTimePasswordCode = string

const oneTimePasswordCodeLength = 6

export function isOneTimePasswordCode(arg: unknown): arg is OneTimePasswordCode {
	return typeof arg === 'string' && arg.length === oneTimePasswordCodeLength
}

export type OneTimePassword = CreationTime & {
	code: OneTimePasswordCode
}

export function generateOneTimePassword(): OneTimePassword {
	const chars = []
	while (chars.length < oneTimePasswordCodeLength) {
		chars.push(String(Math.floor(Math.random() * 10)))
	}
	return { code: chars.join(''), ...createdNow() }
}
