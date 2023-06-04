import { Message } from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC } from "react";

import { OneSectionLayout } from "../layouts/OneSection.js";

const Page: FC = () => (
  <OneSectionLayout>
    <Message color="success">
      <p>Thank you for your purchase.</p>
    </Message>
  </OneSectionLayout>
);

mount(Page);
