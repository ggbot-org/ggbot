import { Column, Columns, Section } from "@ggbot2/design";
import { FC, useState } from "react";
import {
  DeleteStrategy,
  PleasePurchaseModal,
  SchedulingsForm,
  StrategyForm,
  StrategyProfits,
} from "_components";
import { PageLayout } from "_layouts";
import { StrategyInfo } from "_routing";

// TODO create a Strategy Context
type Props = Pick<StrategyInfo, "strategyKey" | "name" | "whenCreated">;

export const ManageStrategyPage: FC<Props> = ({
  strategyKey,
  whenCreated,
  name,
}) => {
  // TODO use a context with useSubscription hook rather than drill down prop to SchedulingsForm
  const [hasActiveSubscription, setHasActiveSubscription] = useState<
    boolean | undefined
  >();

  return (
    <PageLayout>
      {hasActiveSubscription === false && <PleasePurchaseModal />}

      <Section>
        <Columns>
          <Column>
            <StrategyForm strategyKey={strategyKey} whenCreated={whenCreated} />
          </Column>

          <Column>
            <SchedulingsForm
              setHasActiveSubscription={setHasActiveSubscription}
              strategyKey={strategyKey}
            />
          </Column>
        </Columns>

        <Columns>
          <Column>
            <StrategyProfits strategyKey={strategyKey} />
          </Column>
        </Columns>
      </Section>

      <Section>
        <DeleteStrategy
          strategyKey={strategyKey}
          name={name}
          whenCreated={whenCreated}
        />
      </Section>
    </PageLayout>
  );
};
