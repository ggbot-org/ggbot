import { ToastContextProvider } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { Navigation } from "../components/Navigation.js";
import { ViewStrategyFlow } from "../components/ViewStrategyFlow.js";
import { StrategyProvider } from "../contexts/Strategy.js";
import { PageLayout } from "../layouts/Page.js";

export const ViewStrategyFlowPage: FC = () => (
  <I18nContextProvider>
    <StrategyProvider>
      <ToastContextProvider>
        <PageLayout topbar={<Navigation noMenu />}>
          <ViewStrategyFlow />
        </PageLayout>
      </ToastContextProvider>
    </StrategyProvider>
  </I18nContextProvider>
);
