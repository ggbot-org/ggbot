import { AccountStrategy, isAccountStrategy } from "@ggbot2/models";
import { FC, useEffect, useMemo } from "react";
import { Strategies } from "_components/Strategies";
import { useApiAction } from "_hooks";
import { OneSectionLayout } from "_layouts/OneSection";

export const DashboardPage: FC = () => {
  const [readStrategies, { data: strategies }] =
    useApiAction.ReadAccountStrategies();

  const strategyItems = useMemo(() => {
    const strategyItems: AccountStrategy[] = [];
    if (Array.isArray(strategies))
      for (const item of strategies) {
        if (isAccountStrategy(item)) {
          strategyItems.push(item);
          continue;
        }
      }
    return strategyItems;
  }, [strategies]);

  useEffect(() => {
    const controller = readStrategies({});
    return () => {
      controller.abort();
    };
  }, [readStrategies]);

  if (!strategies) return null;

  return (
    <OneSectionLayout>
      <Strategies strategies={strategyItems} />
    </OneSectionLayout>
  );
};
