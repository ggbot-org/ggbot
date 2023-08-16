import { AnchorHTMLAttributes, FC, PropsWithChildren } from "react"
import { Tabs } from "trunx"

import { _classNames } from "./_classNames.js"

export type TabSelectorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	isActive: boolean
}

export const TabSelector: FC<PropsWithChildren<TabSelectorProps>> = ({
	children,
	isActive,
	...props
}) => (
	<li className={_classNames({ "is-active": isActive })}>
		<a {...props}>{children}</a>
	</li>
)

export type TabContentProps = {
	isActive: boolean
}

export const TabContent: FC<PropsWithChildren<TabContentProps>> = ({
	children,
	isActive
}) => <div className={_classNames({ "is-hidden": !isActive })}>{children}</div>

export const TabSelectors: FC<PropsWithChildren> = ({ children }) => (
	<Tabs isBoxed>
		<ul>{children}</ul>
	</Tabs>
)
