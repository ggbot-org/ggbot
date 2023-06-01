import { AccountSettings } from "_components/AccountSettings";
import { DeleteAccount } from "_components/DeleteAccount";
import { OneSectionLayout } from "_layouts/OneSection";
import { Column, Columns } from "@ggbot2/design";
import { mount } from "@ggbot2/react";
import { FC } from "react";

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
