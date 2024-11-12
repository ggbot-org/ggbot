import { isNonEmptyString, NonEmptyString } from './strings.js'

/** A Name is any not empty string, with a max length. */
export type Name = NonEmptyString

export function isName(arg: unknown): arg is Name {
	return isNonEmptyString(arg) && normalizeName(arg) === arg
}

export function normalizeName(name: string) {
	return name.trim()
}
