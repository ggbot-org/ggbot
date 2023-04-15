import { Column, Columns } from "@ggbot2/design";
import { FC } from "react";
import { AccountSettings } from "_components/AccountSettings";
import { DeleteAccount } from "_components/DeleteAccount";
import { OneSectionLayout } from "_layouts/OneSection";

export const AccountSettingsPage: FC = () => {
  return (
    <OneSectionLayout>
      <Columns>
        <Column size="half">
          <AccountSettings />
        </Column>
      </Columns>

      <DeleteAccount />
    </OneSectionLayout>
  );
};
