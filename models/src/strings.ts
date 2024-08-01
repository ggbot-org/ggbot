export type FiniteString = string

export const stringMaxLength = 256

export const isFiniteString = (arg: unknown): arg is FiniteString =>
	typeof arg === "string" && arg.length <= stringMaxLength

export type NonEmptyString<T = string> = T extends "" ? never : T

export function isNonEmptyString(
	arg: unknown
): arg is NonEmptyString<FiniteString> {
	return isFiniteString(arg) && arg !== ""
}

/**
 * A string is an `IdentifierString` if it is finite, not empty and has no line
 * break.
 */
export type IdentifierString = NonEmptyString<FiniteString>

export function isIdentifierString(arg: unknown): arg is IdentifierString {
	return isNonEmptyString(arg) && arg === arg.replace(/[\r\n]/gm, "")
}
