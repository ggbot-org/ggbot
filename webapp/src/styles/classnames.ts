import {
	Bulma,
	classnames as _classnames,
	ClassnamesArg as _ClassnamesArg
} from "trunx"

type CalendarClassname =
	| "Calendar"
	| "Calendar__body"
	| "Calendar__cell"
	| "Calendar__cell--disabled"
	| "Calendar__cell--selected"
	| "Calendar__grid"
	| "Calendar__head"
	| "Calendar__head-icon"
	| "Calendar__head-text"
	| "Calendar__week-day"

type DailyIntervalClassname = "DailyInterval"

type FlowEditorClassname =
	| "FlowEditor__menu"
	| "FlowEditor__strategyName"
	| "FlowEditor__actions"
	| "FlowEditor__container"

type FooterClassname = "Footer__top" | "Footer__body"

type InputClassname = "Input--isStatic"

type ModalClassname = "Modal__content"

type NavigationClassname = "Navigation"

type OneColumn = "OneColumn"

type PageClassname = "Page" | "Page__content" | "Page__footer"

type ParagraphClassname = "Paragraph"

type StrategyItemClassname = "StrategyItem"

type TabSelectorClassname = "TabSelector"

type TermsAndPolicyLinksClassname = "TermsAndPolicyLinks"

type ToastContainerClassname = "ToastContainer"

type Classname =
	| Bulma
	| CalendarClassname
	| DailyIntervalClassname
	| FlowEditorClassname
	| FooterClassname
	| InputClassname
	| ModalClassname
	| NavigationClassname
	| OneColumn
	| PageClassname
	| ParagraphClassname
	| StrategyItemClassname
	| TabSelectorClassname
	| TermsAndPolicyLinksClassname
	| ToastContainerClassname

// TODO why ts-prune complain?
// ts-prune-ignore-next
export const classnames = (...args: Array<_ClassnamesArg<Classname>>) =>
	_classnames(...args)
