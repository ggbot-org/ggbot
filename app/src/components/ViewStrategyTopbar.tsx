import { Buttons, Column, Columns, Flex, Level } from "@ggbot2/design";
import { FC } from "react";

import { classNames } from "../styles/classNames.js";
import { GoCopyStrategy } from "../components/GoCopyStrategy.js";
import { ShareStrategy } from "../components/ShareStrategy.js";
import { StrategyFlowName } from "../components/StrategyFlowName.js";

export const ViewStrategyTopbar: FC = () => (
  <Columns className={classNames("is-marginless")}>
    <StrategyFlowName />

    <Column isNarrow className={classNames("p-0")}>
      <Level
        isMobile
        className={classNames("is-marginless", "p-2")}
        right={
          <Buttons>
            <ShareStrategy />

            <GoCopyStrategy />
          </Buttons>
        }
      >
        <Flex className={classNames("p-4")} />
      </Level>
    </Column>
  </Columns>
);
