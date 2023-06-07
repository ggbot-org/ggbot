import { mount } from "@ggbot2/react";
import { FC } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { EditStrategyFlow } from "../components/EditStrategyFlow.js";
import { StrategyProvider } from "../components/StrategyProvider.js";
import { PageLayout } from "../layouts/Page.js";

const Page: FC = () => (
  <AuthenticationProvider>
    <StrategyProvider>
      <PageLayout>
        <EditStrategyFlow />
      </PageLayout>
    </StrategyProvider>
  </AuthenticationProvider>
);

mount(Page);
