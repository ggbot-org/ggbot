import { mount } from "@ggbot2/react";
import { FC } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { CopyStrategyForm } from "../components/CopyStrategyForm.js";
import { StrategyProvider } from "../components/StrategyProvider.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

export const Page: FC = () => (
  <AuthenticationProvider>
    <StrategyProvider>
      <OneSectionLayout>
        <CopyStrategyForm />
      </OneSectionLayout>
    </StrategyProvider>
  </AuthenticationProvider>
);

mount(Page);
