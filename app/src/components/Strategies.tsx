import { SchedulingsStatusBadges } from "_components/SchedulingsStatusBadges";
import { useApi } from "_hooks/useApi";
import { title } from "_i18n";
import { pathname } from "_routing/pathnames";
import { Box, Column, Columns, Flex, Message, Title } from "@ggbot2/design";
import { AccountStrategy, isAccountStrategy } from "@ggbot2/models";
import { FC, useEffect } from "react";

type StrategyItem = Pick<
  AccountStrategy,
  "strategyId" | "name" | "schedulings"
> & { href: string };

export const Strategies: FC = () => {
  const [READ, { data }] = useApi.ReadAccountStrategies();

  const items: StrategyItem[] = [];
  if (Array.isArray(data)) {
    for (const item of data) {
      if (!isAccountStrategy(item)) continue;
      const { strategyId, strategyKind, name, schedulings } = item;
      items.push({
        href: pathname.strategyPage({ strategyId, strategyKind }),
        name,
        schedulings,
        strategyId,
      });
    }
  }

  useEffect(() => {
    const controller = READ({});
    return () => controller.abort();
  }, [READ]);

  return (
    <>
      <Title>{title.strategies}</Title>

      {data !== undefined && items.length === 0 && (
        <Message color="info">Your strategies list is empty.</Message>
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
