import { Columns, Column, Container, Section, classNames } from "@ggbot2/design";
import { NextPage } from "next";
import { SubscriptionContext } from "_contexts";
import { Navigation, Page, SubscriptionInfo, SubscriptionPurchase } from "_components";
import { useSubscription } from "_hooks";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const BillingSettingsPage: NextPage = () => {
  const subscription = useSubscription();

  return (
    <SubscriptionContext.Provider value={subscription}>
      <Page topbar={<Navigation />}>
        <Container>
          <Section>
            <h1 className={classNames("title")}>Billing</h1>
            <Columns>
              <Column size="half">
                <SubscriptionInfo />
              </Column>

              <Column size="half">
                <SubscriptionPurchase />
              </Column>
            </Columns>
          </Section>
        </Container>
      </Page>
    </SubscriptionContext.Provider>
  );
};

export default BillingSettingsPage;
