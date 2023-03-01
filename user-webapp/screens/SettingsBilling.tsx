import { Columns, Column, Container, Section, classNames } from "@ggbot2/design";
import { FC } from "react";
import { Navigation, Page, SubscriptionInfo, SubscriptionPurchase } from "_components";

export const SettingsBilling: FC = () => {
  return (
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
  );
};
