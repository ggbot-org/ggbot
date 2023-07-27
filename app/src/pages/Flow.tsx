import { ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { TryFlow } from "../components/TryFlow.js";
import { StrategyProvider } from "../contexts/Strategy.js";
import { PageLayout } from "../layouts/Page.js";

export const FlowPage: FC = () => (
  <I18nProvider>
    <StrategyProvider>
      <ToastProvider>
        <PageLayout noMenu>
          <TryFlow />
        </PageLayout>
      </ToastProvider>
    </StrategyProvider>
  </I18nProvider>
);
