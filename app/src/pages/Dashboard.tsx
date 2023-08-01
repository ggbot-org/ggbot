import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { CreateStrategy } from "../components/CreateStrategy.js";
import { PageContainer } from "../components/PageContainer.js";
import { Strategies } from "../components/Strategies.js";
import { Tabs } from "../components/Tabs.js";
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";

export const DashboardPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <PageContainer maxWidth="widescreen">
        <AccountStrategiesProvider>
          <Tabs
            initialTabId="strategies"
            tabs={[
              {
                tabId: "strategies",
                content: <Strategies />,
              },
              {
                tabId: "newStrategy",
                content: <CreateStrategy />,
              },
            ]}
          />
        </AccountStrategiesProvider>
      </PageContainer>
    </AuthenticationProvider>
  </I18nProvider>
);
