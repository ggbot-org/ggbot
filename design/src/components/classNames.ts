import {
	_classNames,
	type _ClassNamesArg,
	type BulmaClassName
} from "../classNames.js"

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

type PageClassName = "Page" | "Page_content" | "Page_footer"

type ToastContainerClassName = "ToastContainer"

type ClassName =
	| BulmaClassName
	| CalendarClassName
	| DailyIntervalClassName
	| ModalClassName
	| PageClassName
	| ToastContainerClassName

/**
 * CSS class helper.
 *
 * @internal
 */
export const classNames = (...args: _ClassNamesArg<ClassName>[]) =>
	_classNames(...args)
