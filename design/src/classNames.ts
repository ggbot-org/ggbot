export {
	classNames as _classNames,
	type ClassNamesArg as _ClassNamesArg,
	type BulmaClassName
} from "trunx"

/**
 * @example
 *
 * ```ts
 * import {
 * 	_classNames,
 * 	_ClassNamesArg,
 * 	BulmaClassName
 * } from "@ggbot2/design"
 *
 * // Add other classes.
 * type ClassName = BulmaClassName | "Foo" | "Bar"
 *
 * export const classNames = (...args: _ClassNamesArg<ClassName>[]) =>
 * 	_classNames(...args)
 * ```
 */
