import { classnames } from "_/classnames"
import { TabContent, TabContentProps, TabSelector, TabSelectors } from "_/components/library"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { FormattedMessage } from "react-intl"

export type TabId =
	| "account"
	| "accounts"
	| "backtesting"
	| "billing"
	| "binance"
	| "errors"
	| "flow"
	| "info"
	| "manage"
	| "newStrategy"
	| "profits"
	| "strategies"

type Tab = {
	tabId: TabId
	content: ReactNode
} & Pick<TabContentProps, "renderIfInactive">

type TabsProps = {
	activeTabId: TabId
	setActiveTabId: Dispatch<SetStateAction<TabId>>
	tabs: Tab[]
}

export function Tabs({ activeTabId, setActiveTabId, tabs }: TabsProps) {
	return (
		<div className={classnames("m-3")}>
			<TabSelectors>
				{tabs.map(({ tabId }) => (
					<TabSelector
						key={tabId}
						isActive={activeTabId === tabId}
						onClick={(event) => {
							event.preventDefault()
							event.stopPropagation()
							setActiveTabId(tabId)
						}}
					>
						<FormattedMessage id={`Tabs.${tabId}`} />
					</TabSelector>
				))}
			</TabSelectors>
			{tabs.map(({ content, tabId, renderIfInactive }) => (
				<TabContent
					key={tabId}
					isActive={activeTabId === tabId}
					renderIfInactive={renderIfInactive}
				>
					{content}
				</TabContent>
			))}
		</div>
	)
}
