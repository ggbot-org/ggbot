import { Section } from "@ggbot2/design";
import { FC } from "react";

import { CopyStrategy } from "../components/CopyStrategy.js";
import { PageContainer } from "../components/PageContainer.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { StrategyProvider } from "../contexts/Strategy.js";

export const CopyStrategyPage: FC = () => (
  <PageContainer maxWidth="widescreen">
    <AuthenticationProvider>
      <AccountStrategiesProvider>
        <StrategyProvider>
          <Section>
            <CopyStrategy />
          </Section>
        </StrategyProvider>
      </AccountStrategiesProvider>
    </AuthenticationProvider>
  </PageContainer>
);
