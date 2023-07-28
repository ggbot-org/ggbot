import { Section } from "@ggbot2/design";
import { FC } from "react";

import { CreateStrategy } from "../components/CreateStrategy.js";
import { Strategies } from "../components/Strategies.js";
import { Tabs } from "../components/Tabs.js";

export const Dashboard: FC = () => (
  <Section>
    <Tabs
      initialTabId="strategies"
      tabs={[
        {
          tabId: "strategies",
          content: <Strategies />,
        },
        {
          tabId: "newStrategy",
          content: <CreateStrategy />,
        },
      ]}
    />
  </Section>
);
