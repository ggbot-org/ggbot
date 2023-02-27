import { Container, Section } from "@ggbot2/design";
import { NextPage } from "next";
import { BillingSettings, Navigation, Page } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const BillingSettingsPage: NextPage = () => {
  return (
    <Page topbar={<Navigation />}>
      <Container isFluid>
        <Section>
          <BillingSettings />
        </Section>
      </Container>
    </Page>
  );
};

export default BillingSettingsPage;
