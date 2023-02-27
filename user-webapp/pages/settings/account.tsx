import { Column, Columns, Container, Section } from "@ggbot2/design";
import { NextPage } from "next";
import { AccountSettings, Navigation, Page } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const AccountSettingsPage: NextPage = () => {
  return (
    <Page topbar={<Navigation />}>
      <Container>
        <Section>
          <Columns>
            <Column size="half">
              <AccountSettings />
            </Column>
          </Columns>
        </Section>
      </Container>
    </Page>
  );
};

export default AccountSettingsPage;
