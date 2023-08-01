import { FC, useState } from "react";

import { Backtesting } from "../components/Backtesting.js";
import { EditableFlow } from "../components/EditableFlow.js";
import { ManageStrategy } from "../components/ManageStrategy.js";
import { PleasePurchase } from "../components/PleasePurchase.js";
import { getStoredTabId, TabId, Tabs } from "../components/Tabs.js";

const pageName = "Strategy";

export const Strategy: FC = () => {
  const [activeTabId, setActiveTabId] = useState<TabId>(
    getStoredTabId(pageName) ?? "backtesting"
  );

  return (
    <>
      <Tabs
        pageName={pageName}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
        tabs={[
          {
            tabId: "manage",
            content: <ManageStrategy />,
          },
          {
            tabId: "backtesting",
            content: <Backtesting />,
          },
          {
            tabId: "flow",
            content: <EditableFlow />,
          },
        ]}
      />

      <PleasePurchase />
    </>
  );
};
