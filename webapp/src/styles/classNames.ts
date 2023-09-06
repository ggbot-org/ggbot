import {
	BulmaClassName,
	classNames as _classNames,
	ClassNamesArg as _ClassNamesArg} from "trunx"

type FlowViewContainerClassName = "FlowViewContainer"

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
	| FlowViewContainerClassName
	| CalendarClassName
	| DailyIntervalClassName
	| ModalClassName
	| PageClassName
	| ToastContainerClassName

export const classNames = (...args: _ClassNamesArg<ClassName>[]) =>
	_classNames(...args)
