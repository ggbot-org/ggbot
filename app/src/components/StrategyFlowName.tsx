import { Column, Flex } from "@ggbot2/design";
import { FC } from "react";

import { pathname } from "../routing/pathnames.js";
import { StrategyInfo } from "../routing/types.js";
import { classNames } from "../styles/classNames.js";

type Props = Pick<StrategyInfo, "strategyKey" | "name">;

export const StrategyFlowName: FC<Props> = ({ name, strategyKey }) => (
  <Column className={classNames("p-0")}>
    <Flex>
      <a
        href={pathname.strategyPage(strategyKey)}
        tabIndex={0}
        className={classNames("has-text-dark", "is-size-5", "py-3", "px-3")}
      >
        {name}
      </a>
    </Flex>
  </Column>
);
