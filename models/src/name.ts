import { isNonEmptyString, NonEmptyString } from "@ggbot2/type-utils"

import { ErrorInvalidArg } from "./errors.js"

/** A Name is any not empty string, with a max length. */
export type Name = NonEmptyString

export const isName = (arg: unknown): arg is Name => isNonEmptyString(arg)

export const throwIfInvalidName = (arg: unknown): void => {
	if (!isName(arg)) throw new ErrorInvalidArg({ arg, type: "Name" })
}

export const normalizeName = (name: string) => name.trim()
