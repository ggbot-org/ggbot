import { classnames } from "_/classnames"
import { AnchorHTMLAttributes, PropsWithChildren } from "react"
import { Tabs } from "trunx"

export type TabSelectorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	isActive: boolean
}

export function TabSelector({
	children,
	isActive,
	...props
}: PropsWithChildren<TabSelectorProps>) {
	return (
		<li className={classnames("tab-selector", { "is-active": isActive })}>
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
	if (!isActive) return null
	return <div>{children}</div>
}

export function TabSelectors({ children }: PropsWithChildren) {
	return <Tabs isBoxed>{children}</Tabs>
}
