import { Bulma, classnames as _classnames, ClassnamesArg as _ClassnamesArg } from "trunx"

type CalendarClassname =
	| "calendar"
	| "calendar__body"
	| "calendar__cell"
	| "calendar__cell--disabled"
	| "calendar__cell--selected"
	| "calendar__grid"
	| "calendar__head"
	| "calendar__head-icon"
	| "calendar__head-text"
	| "calendar__week-day"

type DailyIntervalClassname = "daily-interval"

type FlowEditorClassname =
	| "flow-editor__menu"
	| "flow-editor__strategy-name"
	| "flow-editor__actions"
	| "flow-editor__container"

type FooterClassname = "footer__top" | "footer__body"

type InputClassname = "input--is-static"

type OneColumn = "one-column"

type PageClassname = "page" | "page__content" | "page__footer"

type ParagraphClassname = "paragraph"

type TabSelectorClassname = "tab-selector"

type TermsAndPolicyLinksClassname = "terms-and-policy-links"

type ToastContainerClassname = "toast-container"

type Classname =
	| Bulma
	| CalendarClassname
	| DailyIntervalClassname
	| FlowEditorClassname
	| FooterClassname
	| InputClassname
	| OneColumn
	| PageClassname
	| ParagraphClassname
	| TabSelectorClassname
	| TermsAndPolicyLinksClassname
	| ToastContainerClassname

// TODO why ts-prune complain?
// ts-prune-ignore-next
export function classnames(...args: Array<_ClassnamesArg<Classname>>) {
	return _classnames(...args)
}
