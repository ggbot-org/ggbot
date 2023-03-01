import { Column, Columns, Container, Section, classNames } from "@ggbot2/design";
import { NextPage } from "next";
import { BinanceSettings, Navigation, Page } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const BinanceSettingsPage: NextPage = () => {
  return (
    <Page topbar={<Navigation />}>
      <Container>
        <Section>
          <h1 className={classNames("title")}>Binance</h1>

          <Columns>
            <Column size="half">
              <BinanceSettings />
            </Column>
          </Columns>
        </Section>
      </Container>
    </Page>
  );
};

export default BinanceSettingsPage;
