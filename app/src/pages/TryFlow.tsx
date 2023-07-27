import { FC } from "react";

import { PageContainer } from "../components/PageContainer.js";
import { TryFlow } from "../components/TryFlow.js";
import { StrategyProvider } from "../contexts/Strategy.js";

export const TryFlowPage: FC = () => (
  <PageContainer noMenu>
    <StrategyProvider>
      <TryFlow />
    </StrategyProvider>
  </PageContainer>
);
