import { CreateStrategy } from "_components/CreateStrategy";
import { Strategies } from "_components/Strategies";
import { OneSectionLayout } from "_layouts/OneSection";
import { FC } from "react";

import { mount } from "./_mount.js";

const Page: FC = () => (
  <OneSectionLayout>
    <CreateStrategy />
    <Strategies />
  </OneSectionLayout>
);

mount(Page);
