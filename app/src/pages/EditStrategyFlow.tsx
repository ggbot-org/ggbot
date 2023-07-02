import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { EditStrategyFlow } from "../components/EditStrategyFlow.js";
import { StrategyProvider } from "../components/StrategyProvider.js";
import { PageLayout } from "../layouts/Page.js";

export const EditStrategyFlowPage: FC = () => (
  <I18nContextProvider>
    <AuthenticationProvider>
      <StrategyProvider>
        <PageLayout>
          <EditStrategyFlow />
        </PageLayout>
      </StrategyProvider>
    </AuthenticationProvider>
  </I18nContextProvider>
);
