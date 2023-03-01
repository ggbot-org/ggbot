import { Column, Columns, Container, Section, classNames } from "@ggbot2/design";
import { FC } from "react";
import { BinanceSettings, Navigation, Page } from "_components";

export const SettingsBinance: FC = () => {
  return (
    <Page topbar={<Navigation />}>
      <Section>
        <Container>
          <h1 className={classNames("title")}>Binance</h1>

          <Columns>
            <Column size="half">
              <BinanceSettings />
            </Column>
          </Columns>
        </Container>
      </Section>
    </Page>
  );
};
