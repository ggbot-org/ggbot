import { Column, Flex } from "@ggbot2/design";
import Link from "next/link";
import { FC } from "react";
import { classNames } from "_classNames";
import { StrategyInfo, pathname } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "name">;

export const StrategyFlowName: FC<Props> = ({ name, strategyKey }) => {
  return (
    <Column className={classNames("p-0")}>
      <Flex>
        <Link
          href={pathname.strategyPage(strategyKey)}
          passHref
          tabIndex={0}
          className={classNames("has-text-dark", "is-size-5", "py-3", "px-3")}
        >
          {name}
        </Link>
      </Flex>
    </Column>
  );
};