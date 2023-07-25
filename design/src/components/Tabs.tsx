import { FC, PropsWithChildren } from "react";
import { Tabs as _Tabs } from "trunx";

import { _classNames } from "./_classNames.js";

/**
 * Create `MyTabs` component
 *
 * @example
 *
 * ```ts
 * import {
 *   Tabs,
 *   TabSelector,
 *   TabSelectorProps,
 *   TabContent,
 * } from "@ggbot2/design";
 * import { FC, ReactNode, useCallback, useState } from "react";
 *
 * const tabIds = ["first", "second"] as const;
 * type TabId = (typeof tabIds)[number];
 *
 * type Props = Record<TabId, ReactNode>;
 *
 * export const MyTabs: FC<Props> = (props) => {
 *   const tabLabel = {
 *     first: "First Tag",
 *     second: "Another Tab",
 *   };
 *
 *   const [activeTabId, setActiveTabId] = useState<TabId>("flow");
 *   const setSelected = useCallback<
 *     (tabId: TabId) => TabSelectorProps["setSelected"]
 *   >(
 *     (tabId) => () => {
 *       setActiveTabId(tabId);
 *     },
 *     []
 *   );
 *
 *   return (
 *     <>
 *       <Tabs>
 *         {tabIds.map((tabId) => (
 *           <TabSelector
 *             selected={activeTabId === tabId}
 *             setSelected={setSelected(tabId)}
 *           >
 *             {tabLabel[tabId]}
 *           </TabSelector>
 *         ))}
 *       </Tabs>
 *
 *       {tabIds.map((tabId) => (
 *         <TabContent key={tabId} isActive={activeTabId === tabId}>
 *           {props[tabId]}
 *         </TabContent>
 *       ))}
 *     </>
 *   );
 * };
 * ```
 *
 * Then use it.
 *
 * ```ts
 * <MyTabs
 *   first={<>This is first tab.</>}
 *   second={<>This is another tab.</>}
 * />;
 * ```
 */
export const Tabs: FC<PropsWithChildren> = ({ children }) => (
  <_Tabs isBoxed>
    <ul>{children}</ul>
  </_Tabs>
);

export type TabSelectorProps = {
  selected: boolean;
  setSelected: () => void;
};

export const TabSelector: FC<PropsWithChildren<TabSelectorProps>> = ({
  children,
  selected,
  setSelected,
}) => (
  <li className={_classNames({ "is-active": selected })}>
    <a
      onClick={(event) => {
        event.preventDefault();
        setSelected();
      }}
    >
      {children}
    </a>
  </li>
);

export type TabContentProps = {
  isActive: boolean;
};

export const TabContent: FC<PropsWithChildren<TabContentProps>> = ({
  children,
  isActive,
}) => <div className={_classNames({ "is-hidden": !isActive })}>{children}</div>;
