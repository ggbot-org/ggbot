import {
  TabContent,
  Tabs,
  TabSelector,
  TabSelectorProps,
} from "@ggbot2/design";
import { FC, ReactNode, useMemo, useState } from "react";
import { useIntl } from "react-intl";

const tabIds = ["flow", "backtest"] as const;
type TabId = (typeof tabIds)[number];

type Props = Record<TabId, ReactNode>;

export const ViewStrategyTabs: FC<Props> = (props) => {
  const { formatMessage } = useIntl();

  const [activeTabId, setActiveTabId] = useState<TabId>("flow");

  const tabSelectors = useMemo<
    (TabSelectorProps & {
      tabId: TabId;
      label: string;
    })[]
  >(
    () =>
      tabIds.map((tabId) => ({
        tabId,
        selected: activeTabId === tabId,
        setSelected: () => {
          setActiveTabId(tabId);
        },
        label: formatMessage({ id: `tabLabel.${tabId}` }),
      })),
    [activeTabId, formatMessage]
  );

  return (
    <>
      <Tabs>
        {tabSelectors.map(({ tabId, selected, setSelected, label }) => (
          <TabSelector
            key={tabId}
            selected={selected}
            setSelected={setSelected}
          >
            {label}
          </TabSelector>
        ))}
      </Tabs>

      {tabIds.map((tabId) => (
        <TabContent key={tabId} isActive={activeTabId === tabId}>
          {props[tabId]}
        </TabContent>
      ))}
    </>
  );
};
