import { Column, Columns, Section } from "@ggbot2/design";
import { FC, useState } from "react";
import { DeleteStrategy } from "_components/DeleteStrategy";
import { PleasePurchaseModal } from "_components/PleasePurchaseModal";
import { SchedulingsForm } from "_components/SchedulingsForm";
import { StrategyForm } from "_components/StrategyForm";
import { StrategyProfits } from "_components/StrategyProfits";
import { PageLayout } from "_layouts/Page";
import { StrategyInfo } from "_routing/types";

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
