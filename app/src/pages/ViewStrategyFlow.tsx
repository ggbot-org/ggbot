import { mount } from "@ggbot2/react";
import { FC } from "react";

import { Navigation } from "../components/Navigation.js";
import { StrategyProvider } from "../components/StrategyProvider.js";
import { ViewStrategyFlow } from "../components/ViewStrategyFlow.js";
import { PageLayout } from "../layouts/Page.js";

const Page: FC = () => (
  <StrategyProvider>
    <PageLayout topbar={<Navigation noMenu />}>
      <ViewStrategyFlow />
    </PageLayout>
  </StrategyProvider>
);

mount(Page);
