import { isNonEmptyString, NonEmptyString } from "./strings.js"

/** A Name is any not empty string, with a max length. */
export type Name = NonEmptyString

export const isName = (arg: unknown): arg is Name =>
	isNonEmptyString(arg) && normalizeName(arg) === arg

export const normalizeName = (name: string) => name.trim()
