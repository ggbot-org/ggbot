import { FC, useState } from "react";

import { Backtesting } from "../components/Backtesting.js";
import { ReadonlyFlow } from "../components/ReadonlyFlow.js";
import { getStoredTabId, TabId, Tabs } from "../components/Tabs.js";

const pageName = "TryFlow";

export const TryFlow: FC = () => {
  const [activeTabId, setActiveTabId] = useState<TabId>(
    getStoredTabId(pageName) ?? "backtesting"
  );

  return (
    <Tabs
      pageName={pageName}
      activeTabId={activeTabId}
      setActiveTabId={setActiveTabId}
      tabs={[
        {
          tabId: "backtesting",
          content: <Backtesting />,
        },
        {
          tabId: "flow",
          content: <ReadonlyFlow />,
        },
      ]}
    />
  );
};
