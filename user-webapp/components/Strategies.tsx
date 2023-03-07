import { Box, Columns, Column, Flex, Title } from "@ggbot2/design";
import { AccountStrategy } from "@ggbot2/models";
import Link from "next/link";
import { FC, useMemo } from "react";
import { route } from "_routing";
import { SchedulingsStatusBadges } from "./SchedulingsStatusBadges";

type Props = {
  strategies: Pick<AccountStrategy, "name" | "strategyId" | "strategyKind" | "schedulings">[];
};

export const Strategies: FC<Props> = ({ strategies }) => {
  const items = useMemo(
    () =>
      strategies.map(({ strategyId, strategyKind, name, schedulings }) => ({
        href: route.strategyPage({ strategyId, strategyKind }),
        name,
        schedulings,
      })),
    [strategies]
  );

  return (
    <>
      <Title>Strategies</Title>

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
    </>
  );
};
