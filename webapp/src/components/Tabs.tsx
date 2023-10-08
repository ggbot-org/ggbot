import { classNames } from "_/classNames"
import {
	TabContent,
	TabContentProps,
	TabSelector,
	TabSelectorProps,
	TabSelectors
} from "_/components/library"
import { PageName } from "_/routing/pageNames"
import { sessionWebStorage } from "_/storages/session"
import {
	Dispatch,
	FC,
	PropsWithChildren,
	ReactNode,
	SetStateAction,
	useMemo
} from "react"
import { useIntl } from "react-intl"

const tabIds = [
	"accounts",
	"backtesting",
	"flow",
	"manage",
	"newStrategy",
	"orders",
	"strategies"
] as const
export type TabId = (typeof tabIds)[number]

export const getStoredTabId = (pageName: PageName) =>
	sessionWebStorage.getActiveTabId<TabId>(pageName, tabIds)

type Tab = { tabId: TabId; content: ReactNode }

type TabsProps = {
	activeTabId: TabId
	setActiveTabId: Dispatch<SetStateAction<TabId>>
	tabs: Tab[]
	pageName: PageName
}

type ItemList<Props> = (PropsWithChildren<Props> & Pick<Tab, "tabId">)[]

export const Tabs: FC<TabsProps> = ({
	activeTabId,
	setActiveTabId,
	tabs,
	pageName
}) => {
	const { formatMessage } = useIntl()

	const tabSelectors = useMemo<ItemList<TabSelectorProps>>(
		() =>
			tabs.map(({ tabId }) => ({
				tabId,
				isActive: activeTabId === tabId,
				onClick: (event) => {
					event.preventDefault()
					event.stopPropagation()
					setActiveTabId(() => {
						sessionWebStorage.setActiveTabId(pageName, tabId)
						return tabId
					})
				},
				children: formatMessage({ id: `Tabs.${tabId}` })
			})),
		[activeTabId, pageName, formatMessage, setActiveTabId, tabs]
	)

	const tabContents = useMemo<ItemList<TabContentProps>>(
		() =>
			tabs.map(({ tabId, content }) => ({
				tabId,
				isActive: activeTabId === tabId,
				children: content
			})),
		[activeTabId, tabs]
	)

	return (
		<div className={classNames("m-5")}>
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
