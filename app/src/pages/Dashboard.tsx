import { mount } from "@ggbot2/react";
import { FC } from "react";

import { Authentication } from "../components/Authentication.js";
import { CreateStrategy } from "../components/CreateStrategy.js";
import { Strategies } from "../components/Strategies.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

const Page: FC = () => (
  <Authentication>
    <OneSectionLayout>
      <CreateStrategy />
      <Strategies />
    </OneSectionLayout>
  </Authentication>
);

mount(Page);
