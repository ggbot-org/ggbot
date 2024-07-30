import { classnames } from "_/classnames"
import { AnchorHTMLAttributes, PropsWithChildren } from "react"
import { Div, Tabs } from "trunx"

export type TabSelectorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	isActive: boolean
}

export function TabSelector({
	children,
	isActive,
	...props
}: PropsWithChildren<TabSelectorProps>) {
	return (
		<li className={classnames("TabSelector", { "is-active": isActive })}>
			<a {...props}>{children}</a>
		</li>
	)
}

export type TabContentProps = {
	isActive: boolean
}

export function TabContent({
	children,
	isActive
}: PropsWithChildren<TabContentProps>) {
	return <Div bulma={{ "is-hidden": !isActive }}>{children}</Div>
}

export function TabSelectors({ children }: PropsWithChildren) {
	return <Tabs isBoxed>{children}</Tabs>
}
