import { classnames } from "_/classnames"
import { TabContent, TabContentProps, TabSelector, TabSelectorProps, TabSelectors } from "_/components/library"
import { Dispatch, PropsWithChildren, ReactNode, SetStateAction, useMemo } from "react"
import { useIntl } from "react-intl"

const tabIds = [
	"account",
	"accounts",
	"backtesting",
	"billing",
	"binance",
	"errors",
	"flow",
	"info",
	"manage",
	"newStrategy",
	"profits",
	"strategies",
] as const
export type TabId = (typeof tabIds)[number]

type Tab = { tabId: TabId; content: ReactNode }

type TabsProps = {
	activeTabId: TabId
	setActiveTabId: Dispatch<SetStateAction<TabId>>
	tabs: Tab[]
}

type ItemList<Props> = Array<PropsWithChildren<Props> & Pick<Tab, "tabId">>

export function Tabs({ activeTabId, setActiveTabId, tabs }: TabsProps) {
	const { formatMessage } = useIntl()

	const tabSelectors = useMemo<ItemList<TabSelectorProps>>(
		() => tabs.map(({ tabId }) => ({
			tabId,
			isActive: activeTabId === tabId,
			onClick: (event) => {
				event.preventDefault()
				event.stopPropagation()
				setActiveTabId(tabId)
			},
			children: formatMessage({ id: `Tabs.${tabId}` })
		})),
		[activeTabId, formatMessage, setActiveTabId, tabs]
	)

	const tabContents = useMemo<ItemList<TabContentProps>>(
		() => tabs.map(({ tabId, content }) => ({
			tabId,
			isActive: activeTabId === tabId,
			children: content
		})),
		[activeTabId, tabs]
	)

	return (
		<div className={classnames("m-3")}>
			<TabSelectors>
				{tabSelectors.map(({ children, tabId, ...props }) => (
					<TabSelector key={tabId} {...props}>
						{children}
					</TabSelector>
				))}
			</TabSelectors>
			{tabContents.map(({ children, tabId, ...props }) => (
				<TabContent key={tabId} {...props}>
					{children}
				</TabContent>
			))}
		</div>
	)
}
