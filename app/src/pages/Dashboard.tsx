import { ToastContextProvider } from "@ggbot2/design";
import { I18nContextProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { CreateStrategy } from "../components/CreateStrategy.js";
import { Strategies } from "../components/Strategies.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const DashboardPage: FC = () => (
  <I18nContextProvider>
    <AuthenticationProvider>
      <ToastContextProvider>
        <OneSectionLayout>
          <CreateStrategy />

          <Strategies />
        </OneSectionLayout>
      </ToastContextProvider>
    </AuthenticationProvider>
  </I18nContextProvider>
);
