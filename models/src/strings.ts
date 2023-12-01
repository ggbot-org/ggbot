export type FiniteString = string

export const stringMaxLength = 256

export const isFiniteString = (arg: unknown): arg is FiniteString =>
	typeof arg === "string" && arg.length <= stringMaxLength

export type NonEmptyString<T = string> = T extends "" ? never : T

export const isNonEmptyString = (
	arg: unknown
): arg is NonEmptyString<FiniteString> => isFiniteString(arg) && arg !== ""

/**
 * A string is an `IdentifierString` if it is finite, not empty and has no line
 * break.
 */
export type IdentifierString = NonEmptyString<FiniteString>

export const isIdentifierString = (arg: unknown): arg is IdentifierString =>
	isNonEmptyString(arg) && arg === arg.replace(/[\r\n]/gm, "")
