import {
	BulmaClassName,
	classNames as _classNames,
	ClassNamesArg as _ClassNamesArg
} from "trunx"

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

type DailyIntervalClassName = "DailyInterval"

type FlowMenuClassName = "FlowMenu" | "FlowMenu__strategyName"

type FlowViewContainerClassName = "FlowViewContainer"

type InputClassName = "Input--isStatic"

type ModalClassName = "Modal__content"

type OneColumn = "OneColumn"

type PageClassName = "Page" | "Page_content" | "Page_footer"

type ToastContainerClassName = "ToastContainer"

type ClassName =
	| BulmaClassName
	| CalendarClassName
	| DailyIntervalClassName
	| FlowMenuClassName
	| FlowViewContainerClassName
	| InputClassName
	| ModalClassName
	| OneColumn
	| PageClassName
	| ToastContainerClassName

export const classNames = (...args: _ClassNamesArg<ClassName>[]) =>
	_classNames(...args)
