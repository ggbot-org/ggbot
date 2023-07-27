import { Section } from "@ggbot2/design";
import { FC } from "react";

import { BinanceSettings } from "../components/BinanceSettings.js";
import { PageContainer } from "../components/PageContainer.js";
import { AuthenticationProvider } from "../contexts/Authentication.js";

export const BinanceSettingsPage: FC = () => (
  <PageContainer>
    <AuthenticationProvider>
      <Section>
        <BinanceSettings />
      </Section>
    </AuthenticationProvider>
  </PageContainer>
);
