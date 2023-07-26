import { ToastProvider } from "@ggbot2/design";
import { I18nProvider } from "@ggbot2/i18n";
import { FC } from "react";

import { BinanceSettings } from "../components/BinanceSettings.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const BinanceSettingsPage: FC = () => (
  <I18nProvider>
    <AuthenticationProvider>
      <ToastProvider>
        <OneSectionLayout>
          <BinanceSettings />
        </OneSectionLayout>
      </ToastProvider>
    </AuthenticationProvider>
  </I18nProvider>
);
