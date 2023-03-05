import { Column, Columns } from "@ggbot2/design";
import { FC } from "react";
import { BinanceSettings } from "_components";
import { OneSectionLayout } from "_layouts";

export const SettingsBinancePage: FC = () => {
  return (
    <OneSectionLayout>
      <Columns>
        <Column size="half">
          <BinanceSettings />
        </Column>
      </Columns>
    </OneSectionLayout>
  );
};
