import { Column, Flex } from "@ggbot2/design";
import { FC, useContext } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { href } from "../routing/hrefs.js";
import { classNames } from "../styles/classNames.js";

export const StrategyFlowName: FC = () => {
  const { strategyKey, strategyName } = useContext(StrategyContext);

  return (
    <Column className={classNames("p-0")}>
      <Flex>
        <a
          href={href.manageStrategyPage(strategyKey)}
          tabIndex={0}
          className={classNames("has-text-dark", "is-size-5", "py-3", "px-3")}
        >
          {strategyName}
        </a>
      </Flex>
    </Column>
  );
};
