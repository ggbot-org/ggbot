import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { CreateStrategy } from "../components/CreateStrategy.js";
import { Strategies } from "../components/Strategies.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const DashboardPage: FC = () => (
  <I18nContextProvider>
    <AuthenticationProvider>
      <OneSectionLayout>
        <CreateStrategy />
        <Strategies />
      </OneSectionLayout>
    </AuthenticationProvider>
  </I18nContextProvider>
);
