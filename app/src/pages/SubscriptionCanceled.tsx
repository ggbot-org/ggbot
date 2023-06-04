import { Message } from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC } from "react";

import { OneSectionLayout } from "../layouts/OneSection.js";

const Page: FC = () => (
  <OneSectionLayout>
    <Message color="warning">
      <p>Your purchase was canceled.</p>
    </Message>
  </OneSectionLayout>
);

mount(Page);
