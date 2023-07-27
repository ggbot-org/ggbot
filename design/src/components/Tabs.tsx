import { Dispatch, FC, ReactNode, SetStateAction, useMemo } from "react";
import { Section, Tabs as _Tabs } from "trunx";

// TODO maybe move this component (or the logic of this component) in app workspace,
// for example with TabContent and TabSelector components.
// so for example settings that has several pages can be done with hyperlinks
import { _classNames } from "./_classNames.js";

export type TabsProps = {
  activeTabId: string;
  setActiveTabId: Dispatch<SetStateAction<string>>;
  tabs: {
    tabId: string;
    /* When clicked, the corresponding tab is selected. Can be a simple label. */
    selector: ReactNode;
    /* Content displayd when tab is selected. */
    content: ReactNode;
  }[];
};

export const Tabs: FC<TabsProps> = ({ activeTabId, setActiveTabId, tabs }) => {
  const selectors = useMemo(
    () =>
      tabs.map(({ tabId, selector }) => ({
        tabId,
        setSelected: () => {
          setActiveTabId(tabId);
        },
        selector,
      })),
    [setActiveTabId, tabs]
  );

  return (
    <Section>
      <_Tabs isBoxed>
        <ul>
          {selectors.map(({ tabId, setSelected, selector }) => (
            <li
              key={tabId}
              className={_classNames({ "is-active": activeTabId === tabId })}
            >
              <a
                onClick={(event) => {
                  event.preventDefault();
                  setSelected();
                }}
              >
                {selector}
              </a>
            </li>
          ))}
        </ul>
      </_Tabs>

      {tabs.map(({ content, tabId }) => (
        <div
          key={tabId}
          className={_classNames({ "is-hidden": activeTabId !== tabId })}
        >
          {content}
        </div>
      ))}
    </Section>
  );
};
