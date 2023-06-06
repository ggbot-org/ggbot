import { Column, Flex } from "@ggbot2/design";
import { FC, useContext } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { pathname } from "../routing/pathnames.js";
import { classNames } from "../styles/classNames.js";

export const StrategyFlowName: FC = () => {
  const { strategyKey, strategyName } = useContext(StrategyContext);

  const href = strategyKey ? pathname.manageStrategyPage(strategyKey) : "";

  return (
    <Column className={classNames("p-0")}>
      <Flex>
        <a
          href={href}
          tabIndex={0}
          className={classNames("has-text-dark", "is-size-5", "py-3", "px-3")}
        >
          {strategyName}
        </a>
      </Flex>
    </Column>
  );
};
