import { Column, Columns, Section } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC, useState } from "react";

import { DeleteStrategy } from "../components/DeleteStrategy.js";
import { PleasePurchase } from "../components/PleasePurchase.js";
import { Schedulings } from "../components/Schedulings.js";
import { StrategyInfo } from "../components/StrategyInfo.js";
import { StrategyProfits } from "../components/StrategyProfits.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { StrategyProvider } from "../contexts/Strategy.js";
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
            {hasActiveSubscription === false && <PleasePurchase />}

            <Section>
              <Columns>
                <Column>
                  <StrategyInfo />
                </Column>

                <Column>
                  <Schedulings
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
