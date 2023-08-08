import { Flex } from "@ggbot2/design";
import { FC, PropsWithChildren, useContext } from "react";

import { StrategyContext } from "../contexts/Strategy.js";

// TODO trunx spacing value cannot be 4, fix it.
export const FlowMenu: FC<PropsWithChildren> = ({ children }) => {
  const { strategy } = useContext(StrategyContext);

  return (
    <Flex
      alignItems="center"
      justify="space-between"
      spacing={{ mb: 5, pl: 5 }}
    >
      <div>
        <span>{strategy.name}</span>
      </div>

      <div>{children}</div>
    </Flex>
  );
};
