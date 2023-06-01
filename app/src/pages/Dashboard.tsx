import { CreateStrategy } from "_components/CreateStrategy";
import { Strategies } from "_components/Strategies";
import { OneSectionLayout } from "_layouts/OneSection";
import { mount } from "@ggbot2/react";
import { FC } from "react";

const Page: FC = () => (
  <OneSectionLayout>
    <CreateStrategy />
    <Strategies />
  </OneSectionLayout>
);

mount(Page);
