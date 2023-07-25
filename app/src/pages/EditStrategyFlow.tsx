import { ToastContextProvider } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { EditStrategyFlow } from "../components/EditStrategyFlow.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { StrategyProvider } from "../contexts/Strategy.js";
import { PageLayout } from "../layouts/Page.js";

export const EditStrategyFlowPage: FC = () => (
  <I18nContextProvider>
    <AuthenticationProvider>
      <StrategyProvider>
        <ToastContextProvider>
          <PageLayout>
            <EditStrategyFlow />
          </PageLayout>
        </ToastContextProvider>
      </StrategyProvider>
    </AuthenticationProvider>
  </I18nContextProvider>
);
