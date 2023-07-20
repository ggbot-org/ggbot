import { Buttons, Column, Columns, Flex, Level } from "@ggbot2/design";
import { FC } from "react";

import { classNames } from "../styles/classNames.js";
import { GoCopyStrategyButton } from "./GoCopyStrategyButton.js";
import { ShareStrategyButton } from "./ShareStrategyButton.js";
import { StrategyFlowName } from "./StrategyFlowName.js";

export const ViewStrategyTopbar: FC = () => (
  <Columns className={classNames("is-marginless")}>
    <StrategyFlowName />

    <Column isNarrow className={classNames("p-0")}>
      <Level
        isMobile
        className={classNames("is-marginless", "p-2")}
        right={
          <Buttons>
            <ShareStrategyButton />

            <GoCopyStrategyButton />
          </Buttons>
        }
      >
        <Flex className={classNames("p-4")} />
      </Level>
    </Column>
  </Columns>
);
