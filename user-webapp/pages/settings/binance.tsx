import { Container, Section } from "@ggbot2/design";
import { NextPage } from "next";
import { BinanceSettings, Navigation, Page } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const BinanceSettingsPage: NextPage = () => {
  return (
    <Page topbar={<Navigation />}>
      <Container isFluid>
        <Section>
          <BinanceSettings />
        </Section>
      </Container>
    </Page>
  );
};

export default BinanceSettingsPage;
