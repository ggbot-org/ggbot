import { BulmaClassName } from "trunx"

export { classNames, type ClassNamesArg } from "trunx"

export type ClassName = BulmaClassName

/**
 * @example
 *
 * ```ts
 * import {
 * 	ClassName as _ClassName,
 * 	classNames as _classNames,
 * 	ClassNamesArg
 * } from "@ggbot2/design"
 *
 * // Add other classes.
 * type ClassName = _ClassName | "Foo" | "Bar"
 *
 * export const classNames = (...args: ClassNamesArg<ClassName>[]) =>
 * 	_classNames(...args)
 * ```
 */
