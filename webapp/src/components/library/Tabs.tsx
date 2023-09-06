import { classNames } from "_/classNames"
import { AnchorHTMLAttributes, FC, PropsWithChildren } from "react"
import { Tabs } from "trunx"

export type TabSelectorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	isActive: boolean
}

export const TabSelector: FC<PropsWithChildren<TabSelectorProps>> = ({
	children,
	isActive,
	...props
}) => (
	<li className={classNames({ "is-active": isActive })}>
		<a {...props}>{children}</a>
	</li>
)

export type TabContentProps = {
	isActive: boolean
}

export const TabContent: FC<PropsWithChildren<TabContentProps>> = ({
	children,
	isActive
}) => <div className={classNames({ "is-hidden": !isActive })}>{children}</div>

export const TabSelectors: FC<PropsWithChildren> = ({ children }) => (
	<Tabs isBoxed>
		<ul>{children}</ul>
	</Tabs>
)
