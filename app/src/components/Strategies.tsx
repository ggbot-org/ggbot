import { Box, Column, Columns, Flex, Message, Title } from "@ggbot2/design";
import { AccountStrategy, isAccountStrategy } from "@ggbot2/models";
import { FC, useEffect } from "react";

import { useApi } from "../hooks/useApi.js";
import { message, title } from "../i18n/index.js";
import { href } from "../routing/hrefs.js";
import { SchedulingsStatusBadges } from "./SchedulingsStatusBadges.js";

type StrategyItem = Pick<
  AccountStrategy,
  "strategyId" | "name" | "schedulings"
> & { href: string };

export const Strategies: FC = () => {
  const {
    request: READ,
    data,
    error,
    isPending,
  } = useApi.ReadAccountStrategies();

  const items: StrategyItem[] = [];
  if (Array.isArray(data)) {
    for (const item of data) {
      if (!isAccountStrategy(item)) continue;
      const { strategyId, strategyKind, name, schedulings } = item;
      items.push({
        href: href.manageStrategyPage({ strategyId, strategyKind }),
        name,
        schedulings,
        strategyId,
      });
    }
  }

  useEffect(() => {
    if (isPending || data !== undefined) return;
    const controller = READ({});
    return () => controller.abort();
  }, [READ, data, error, isPending]);

  return (
    <>
      <Title>{title.strategies}</Title>

      {data !== undefined && items.length === 0 && (
        <Message color="info">{message.noStrategy}</Message>
      )}

      <Columns isMultiline>
        {items.map(({ name, href, schedulings, strategyId }) => (
          <Column key={strategyId} size="half">
            <a href={href} tabIndex={0}>
              <Box>
                <Flex justify="space-between">
                  {name}

                  <SchedulingsStatusBadges schedulings={schedulings} />
                </Flex>
              </Box>
            </a>
          </Column>
        ))}
      </Columns>
    </>
  );
};
