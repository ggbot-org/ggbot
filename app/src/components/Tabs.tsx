import { renderTabs, Section } from "@ggbot2/design";
import { FC, ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";

export const tabIds = [
  "backtesting",
  "flow",
  "manage",
  "newStrategy",
  "strategies",
] as const;
export type TabId = (typeof tabIds)[number];

type TabsProps = {
  initialTabId: TabId;
  tabs: { tabId: TabId; content: ReactNode }[];
};

export const Tabs: FC<TabsProps> = ({ initialTabId, tabs: tabsContent }) => {
  const { formatMessage } = useIntl();

  const tabs = useMemo(
    () =>
      tabsContent.map(({ tabId, content }) => ({
        tabId,
        selector: formatMessage({ id: `Tabs.${tabId}` }),
        content,
      })),
    [formatMessage, tabsContent]
  );

  const Component = renderTabs(initialTabId, tabs);

  return (
    <Section>
      <Component />
    </Section>
  );
};
