import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { CopyStrategyForm } from "../components/CopyStrategyForm.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { StrategyProvider } from "../contexts/Strategy.js";
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
