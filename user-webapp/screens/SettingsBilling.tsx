import { Columns, Column, Container, Section, classNames } from "@ggbot2/design";
import { FC } from "react";
import { Navigation, Page, SubscriptionInfo, SubscriptionPurchase } from "_components";

export const SettingsBilling: FC = () => {
  return (
    <Page topbar={<Navigation />}>
      <Section>
        <Container>
          <h1 className={classNames("title")}>Billing</h1>

          <Columns>
            <Column>
              <SubscriptionInfo />
            </Column>

            <Column>
              <SubscriptionPurchase />
            </Column>
          </Columns>
        </Container>
      </Section>
    </Page>
  );
};
