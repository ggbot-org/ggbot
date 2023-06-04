import { mount } from "@ggbot2/react";
import { FC } from "react";

import { CreateStrategy } from "../components/CreateStrategy.js";
import { Strategies } from "../components/Strategies.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

const Page: FC = () => (
  <OneSectionLayout>
    <CreateStrategy />
    <Strategies />
  </OneSectionLayout>
);

mount(Page);
