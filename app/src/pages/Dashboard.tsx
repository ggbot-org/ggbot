import { mount } from "@ggbot2/react";
import { FC } from "react";

import { AuthenticationProvider } from "../components/AuthenticationProvider.js";
import { CreateStrategy } from "../components/CreateStrategy.js";
import { Strategies } from "../components/Strategies.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

const Page: FC = () => (
  <AuthenticationProvider>
    <OneSectionLayout>
      <CreateStrategy />
      <Strategies />
    </OneSectionLayout>
  </AuthenticationProvider>
);

mount(Page);
