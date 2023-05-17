import { classNames } from "_classNames";
import { pathname } from "_routing/pathnames";
import { StrategyInfo } from "_routing/types";
import { Column, Flex } from "@ggbot2/design";
import Link from "next/link";
import { FC } from "react";

type Props = Pick<StrategyInfo, "strategyKey" | "name">;

export const StrategyFlowName: FC<Props> = ({ name, strategyKey }) => (
  <Column className={classNames("p-0")}>
    <Flex>
      <Link
        passHref
        href={pathname.strategyPage(strategyKey)}
        tabIndex={0}
        className={classNames("has-text-dark", "is-size-5", "py-3", "px-3")}
      >
        {name}
      </Link>
    </Flex>
  </Column>
);
