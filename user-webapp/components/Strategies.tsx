import { Box, Columns, Column, Flex, Message, Title } from "@ggbot2/design";
import { AccountStrategy } from "@ggbot2/models";
import Link from "next/link";
import { title } from "_i18n";
import { FC } from "react";
import { pathname } from "_routing";
import { GoCreateStrategyButton } from "./GoCreateStrategyButton";
import { SchedulingsStatusBadges } from "./SchedulingsStatusBadges";

type Props = {
  strategies?: Pick<
    AccountStrategy,
    "name" | "strategyId" | "strategyKind" | "schedulings"
  >[];
};

export const Strategies: FC<Props> = ({ strategies }) => {
  const items =
    strategies?.map(({ strategyId, strategyKind, name, schedulings }) => ({
      href: pathname.strategyPage({ strategyId, strategyKind }),
      name,
      schedulings,
    })) ?? [];

  return (
    <>
      <Title>{title.strategies}</Title>

      {strategies?.length === 0 && (
        <Message color="info">Your strategies list is empty.</Message>
      )}

      <Columns isMultiline>
        {items.map(({ name, href, schedulings }, i) => (
          <Column key={i} size="half">
            <Link href={href} passHref tabIndex={0}>
              <Box>
                <Flex justify="space-between">
                  {name}
                  <SchedulingsStatusBadges schedulings={schedulings} />
                </Flex>
              </Box>
            </Link>
          </Column>
        ))}
      </Columns>

      <GoCreateStrategyButton />
    </>
  );
};
