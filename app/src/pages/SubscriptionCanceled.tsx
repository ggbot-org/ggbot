import { OneSectionLayout } from "_layouts/OneSection";
import { Message } from "@ggbot2/design";
import { FC } from "react";

import { mount } from "./_mount.js";

const Page: FC = () => (
  <OneSectionLayout>
    <Message color="warning">
      <p>Your purchase was canceled.</p>
    </Message>
  </OneSectionLayout>
);

mount(Page);
