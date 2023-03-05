import { Column, Columns } from "@ggbot2/design";
import { FC } from "react";
import { AccountSettings } from "_components";
import { OneSectionLayout } from "_layouts";

export const SettingsAccountPage: FC = () => {
  return (
    <OneSectionLayout>
      <Columns>
        <Column size="half">
          <AccountSettings />
        </Column>
      </Columns>
    </OneSectionLayout>
  );
};
