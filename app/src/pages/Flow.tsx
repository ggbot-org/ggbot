import { ToastContextProvider } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { ViewStrategyFlow } from "../components/ViewStrategyFlow.js";
import { StrategyProvider } from "../contexts/Strategy.js";
import { PageLayout } from "../layouts/Page.js";

export const FlowPage: FC = () => (
  <I18nContextProvider>
    <StrategyProvider>
      <ToastContextProvider>
        <PageLayout noMenu>
          <ViewStrategyFlow />
        </PageLayout>
      </ToastContextProvider>
    </StrategyProvider>
  </I18nContextProvider>
);
