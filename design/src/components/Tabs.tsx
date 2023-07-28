import {
  AnchorHTMLAttributes,
  FC,
  PropsWithChildren,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { Tabs as _Tabs } from "trunx";

import { _classNames } from "./_classNames.js";

export type TabSelectorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  isActive: boolean;
};

export const TabSelector: FC<PropsWithChildren<TabSelectorProps>> = ({
  children,
  isActive,
  ...props
}) => (
  <li className={_classNames({ "is-active": isActive })}>
    <a {...props}>{children}</a>
  </li>
);

export type TabContentProps = {
  isActive: boolean;
};

export const TabContent: FC<PropsWithChildren<TabContentProps>> = ({
  children,
  isActive,
}) => <div className={_classNames({ "is-hidden": !isActive })}>{children}</div>;

type Tab = {
  /* When clicked, the corresponding tab is selected. Can be a simple label. */
  selector: ReactNode;
  /* Content displayd when tab is selected. */
  content: ReactNode;
};

export const Tabs: FC<PropsWithChildren> = ({ children }) => (
  <_Tabs isBoxed>{children}</_Tabs>
);

type ItemsList<Props> = (PropsWithChildren<Props> & { key: string })[];

export const renderTabs = <TabId extends string = string>(
  initialTabId: TabId,
  tabs: ({ tabId: TabId } & Tab)[]
) => {
  const Tabs: FC = () => {
    const [activeTabId, setActiveTabId] = useState(initialTabId);

    const tabSelectors = useMemo<ItemsList<TabSelectorProps>>(
      () =>
        tabs.map(({ tabId, selector }) => ({
          key: tabId,
          isActive: activeTabId === tabId,
          onClick: (event) => {
            event.preventDefault();
            setActiveTabId(tabId);
          },
          children: selector,
        })),
      [activeTabId]
    );

    const tabContents = useMemo<ItemsList<TabContentProps>>(
      () =>
        tabs.map(({ tabId, content }) => ({
          key: tabId,
          isActive: activeTabId === tabId,
          children: content,
        })),
      [activeTabId]
    );

    return (
      <>
        <_Tabs isBoxed>
          <ul>
            {tabSelectors.map(({ key, children, ...props }) => (
              <TabSelector key={key} {...props}>
                {children}
              </TabSelector>
            ))}
          </ul>
        </_Tabs>

        {tabContents.map(({ key, children, ...props }) => (
          <TabContent key={key} {...props}>
            {children}
          </TabContent>
        ))}
      </>
    );
  };

  return Tabs;
};
