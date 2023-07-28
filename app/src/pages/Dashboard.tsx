import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
import { Dashboard } from "../components/Dashboard.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";

export const DashboardPage: FC = () => (
  <PageContainer>
    <AuthenticationProvider>
      <AccountStrategiesProvider>
        <Dashboard />
      </AccountStrategiesProvider>
    </AuthenticationProvider>
  </PageContainer>
);
