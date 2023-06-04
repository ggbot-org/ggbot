import { Column, Columns } from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC } from "react";

import { AccountSettings } from "../components/AccountSettings.js";
import { DeleteAccount } from "../components/DeleteAccount.js";
import { OneSectionLayout } from "../layouts/OneSection.js";

const Page: FC = () => (
  <OneSectionLayout>
    <Columns>
      <Column size="half">
        <AccountSettings />
      </Column>
    </Columns>

    <DeleteAccount />
  </OneSectionLayout>
);

mount(Page);
