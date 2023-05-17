import { classNames } from "_classNames";
import { tabLabel } from "_i18n";
import { Tabs } from "@ggbot2/design";
import { FC, ReactNode, useState } from "react";

const tabIds = ["flow", "backtest"] as const;
type TabId = (typeof tabIds)[number];

type Props = Record<TabId, ReactNode>;

export const ViewStrategyTabs: FC<Props> = (props) => {
  const [activeTabId, setActiveTabId] = useState<TabId>("flow");

  return (
    <>
      <Tabs>
        <ul>
          {tabIds.map((tabId) => (
            <li
              key={tabId}
              className={classNames({ "is-active": activeTabId === tabId })}
            >
              <a
                onClick={(event) => {
                  event.preventDefault();
                  setActiveTabId(tabId);
                }}
              >
                {tabLabel[tabId]}
              </a>
            </li>
          ))}
        </ul>
      </Tabs>

      {tabIds.map((tabId) => (
        <div
          key={tabId}
          className={classNames({ "is-hidden": activeTabId !== tabId })}
        >
          {props[tabId]}
        </div>
      ))}
    </>
  );
};
