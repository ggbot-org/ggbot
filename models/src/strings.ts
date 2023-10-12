type FiniteString = string

const stringMaxLength = 80

const isFiniteString = (arg: unknown): arg is FiniteString =>
	typeof arg === "string" && arg.length <= stringMaxLength

export type NonEmptyString<T = string> = T extends "" ? never : T

export const isNonEmptyString = (
	arg: unknown
): arg is NonEmptyString<FiniteString> => isFiniteString(arg) && arg !== ""
