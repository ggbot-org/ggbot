import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { CopyStrategyForm } from "../components/CopyStrategyForm.js";
import { StrategyProvider } from "../components/StrategyProvider.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const CopyStrategyPage: FC = () => (
  <I18nContextProvider>
    <AuthenticationProvider>
      <StrategyProvider>
        <OneSectionLayout>
          <CopyStrategyForm />
        </OneSectionLayout>
      </StrategyProvider>
    </AuthenticationProvider>
  </I18nContextProvider>
);
