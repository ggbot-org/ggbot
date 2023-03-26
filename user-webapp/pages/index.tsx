import { AccountStrategy, isAccountStrategy } from "@ggbot2/models";
import { NextPage } from "next";
import { useEffect, useMemo } from "react";
import { Strategies } from "_components";
import { useApiAction } from "_hooks";
import { OneSectionLayout } from "_layouts";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const HomePage: NextPage = () => {
  const [readStrategies, { data: strategies }] =
    useApiAction.ReadAccountStrategies();

  const strategyItems = useMemo(() => {
    const strategyItems: Pick<
      AccountStrategy,
      "name" | "strategyId" | "strategyKind" | "schedulings"
    >[] = [];
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

  if (strategies === undefined) return <OneSectionLayout />;

  return (
    <OneSectionLayout>
      <Strategies strategies={strategyItems} />
    </OneSectionLayout>
  );
};

export default HomePage;
