import { OneSectionLayout } from "_layouts/OneSection";
import { Message } from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC } from "react";

const Page: FC = () => (
  <OneSectionLayout>
    <Message color="warning">
      <p>Your purchase was canceled.</p>
    </Message>
  </OneSectionLayout>
);

mount(Page);
