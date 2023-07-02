import { Column, Columns, Section } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC, useState } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { DeleteStrategy } from "../components/DeleteStrategy.js";
import { PleasePurchaseModal } from "../components/PleasePurchaseModal.js";
import { SchedulingsForm } from "../components/SchedulingsForm.js";
import { StrategyForm } from "../components/StrategyForm.js";
import { StrategyProfits } from "../components/StrategyProfits.js";
import { StrategyProvider } from "../components/StrategyProvider.js";
import { PageLayout } from "../layouts/Page.js";

export const ManageStrategyPage: FC = () => {
  // TODO use a context with useSubscription hook rather than drill down prop to SchedulingsForm
  const [hasActiveSubscription, setHasActiveSubscription] = useState<
    boolean | undefined
  >();

  return (
    <I18nContextProvider>
      <AuthenticationProvider>
        <StrategyProvider>
          <PageLayout>
            {hasActiveSubscription === false && <PleasePurchaseModal />}

            <Section>
              <Columns>
                <Column>
                  <StrategyForm />
                </Column>

                <Column>
                  <SchedulingsForm
                    setHasActiveSubscription={setHasActiveSubscription}
                  />
                </Column>
              </Columns>

              <Columns>
                <Column>
                  <StrategyProfits />
                </Column>
              </Columns>
            </Section>

            <Section>
              <DeleteStrategy />
            </Section>
          </PageLayout>
        </StrategyProvider>
      </AuthenticationProvider>
    </I18nContextProvider>
  );
};
