import {
	Bulma,
	classnames as _classnames,
	ClassnamesArg as _ClassnamesArg
} from "trunx"

type CalendarClassname =
	| "Calendar"
	| "Calendar__body"
	| "Calendar__head"
	| "Calendar__head-icon"
	| "Calendar__head-text"
	| "Calendar__week-day"
	| "Calendar__cell"
	| "Calendar__cell--selected"
	| "Calendar__cell--disabled"

type DailyIntervalClassname = "DailyInterval"

type FlowMenuClassname = "FlowMenu" | "FlowMenu__strategyName"

type FlowViewContainerClassname = "FlowViewContainer"

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
	| FlowMenuClassname
	| FlowViewContainerClassname
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

export const classnames = (...args: Array<_ClassnamesArg<Classname>>) =>
	_classnames(...args)
