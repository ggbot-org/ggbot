import { Section } from "@ggbot2/design";
import { FC } from "react";

import { CreateStrategy } from "../components/CreateStrategy.js";
import { PageContainer } from "../components/PageContainer.js";
import { Strategies } from "../components/Strategies.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";

export const DashboardPage: FC = () => (
  <PageContainer>
    <AuthenticationProvider>
      <AccountStrategiesProvider>
        <Section>
          <CreateStrategy />

          <Strategies />
        </Section>
      </AccountStrategiesProvider>
    </AuthenticationProvider>
  </PageContainer>
);
