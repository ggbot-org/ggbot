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

type FooterClassName = "Footer__top" | "Footer__body"

type InputClassName = "Input--isStatic"

type ModalClassName = "Modal__content"

type OneColumn = "OneColumn"

type PageClassName = "Page" | "Page__content" | "Page__footer"

type ParagraphClassName = "Paragraph"

type ToastContainerClassName = "ToastContainer"

type ClassName =
	| BulmaClassName
	| CalendarClassName
	| DailyIntervalClassName
	| FlowMenuClassName
	| FlowViewContainerClassName
	| FooterClassName
	| InputClassName
	| ModalClassName
	| OneColumn
	| PageClassName
	| ParagraphClassName
	| ToastContainerClassName

export const classNames = (...args: Array<_ClassNamesArg<ClassName>>) =>
	_classNames(...args)
