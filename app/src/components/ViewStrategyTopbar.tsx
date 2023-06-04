import { Buttons, Column, Columns, Flex, Level } from "@ggbot2/design";
import { FC } from "react";

import { StrategyInfo } from "../routing/types.js";
import { classNames } from "../styles/classNames.js";
import { GoCopyStrategyButton } from "./GoCopyStrategyButton.js";
import { ShareStrategyButton } from "./ShareStrategyButton.js";
import { StrategyFlowName } from "./StrategyFlowName.js";

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name">;

export const ViewStrategyTopbar: FC<Props> = ({
  accountIsOwner,
  name,
  strategyKey,
}) => (
  <Columns className={classNames("is-marginless")}>
    <StrategyFlowName name={name} strategyKey={strategyKey} />

    <Column isNarrow className={classNames("p-0")}>
      <Level
        isMobile
        className={classNames("is-marginless", "p-2")}
        right={
          <Buttons>
            <ShareStrategyButton
              strategyKey={strategyKey}
              strategyName={name}
            />

            {accountIsOwner || (
              <GoCopyStrategyButton strategyKey={strategyKey} />
            )}
          </Buttons>
        }
      >
        <Flex className={classNames("p-4")} />
      </Level>
    </Column>
  </Columns>
);
