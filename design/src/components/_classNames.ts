import { BulmaClassName, classNames, ClassNamesArg } from "trunx"

type DailyIntervalClassName = "DailyInterval"

type CalendarClassName =
	| "Calendar"
	| "Calendar__body"
	| "Calendar__head"
	| "Calendar__head-icon"
	| "Calendar__head-text"
	| "Calendar__week-day"
	| "Calendar__cell"
	| "Calendar__cell--selected"
	| "Calendar__cell--disabled"

type ModalClassName = "Modal__content"

type ToastContainerClassName = "ToastContainer"

export { type ClassNamesArg } from "trunx"

export type ClassName =
	| BulmaClassName
	| CalendarClassName
	| DailyIntervalClassName
	| ModalClassName
	| ToastContainerClassName

/**
 * CSS class helper.
 *
 * @internal
 */
export const _classNames = (...args: ClassNamesArg<ClassName>[]) =>
	classNames(...args)
