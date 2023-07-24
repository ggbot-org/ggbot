import { Box, Column, Columns, Flex, Message, Title } from "@ggbot2/design";
import { AccountStrategy, isAccountStrategy } from "@ggbot2/models";
import { FC, useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { SchedulingsStatusBadges } from "../components/SchedulingsStatusBadges.js";
import { useApi } from "../hooks/useApi.js";
import { href } from "../routing/hrefs.js";

type StrategyItem = Pick<
  AccountStrategy,
  "strategyId" | "name" | "schedulings"
> & { href: string };

export const Strategies: FC = () => {
  const READ = useApi.ReadAccountStrategies();
  const data = READ.data;

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
    if (READ.canRun) READ.request();
  }, [READ]);

  return (
    <>
      <Title>
        <FormattedMessage id="Strategies.title" />
      </Title>

      {data !== undefined && items.length === 0 && (
        <Message color="info">
          {<FormattedMessage id="Strategies.noStrategy" />}
        </Message>
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
