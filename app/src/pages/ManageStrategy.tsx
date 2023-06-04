import { Column, Columns, Section } from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC, useState } from "react";

import { DeleteStrategy } from "../components/DeleteStrategy.js";
import { PleasePurchaseModal } from "../components/PleasePurchaseModal.js";
import { SchedulingsForm } from "../components/SchedulingsForm.js";
import { StrategyForm } from "../components/StrategyForm.js";
import { StrategyProfits } from "../components/StrategyProfits.js";
import { PageLayout } from "../layouts/Page.js";
import { StrategyInfo } from "../routing/types.js";

// TODO create a Strategy Context
type Props = Pick<StrategyInfo, "strategyKey" | "name" | "whenCreated">;

const Page: FC<Props> = ({ strategyKey, whenCreated, name }) => {
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

mount(Page);
