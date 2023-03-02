import { Container, Message, Section } from "@ggbot2/design";
import { FC } from "react";
import { Navigation, Page } from "_components";

export const SubscriptionPurchased: FC = () => {
  return (
    <Page topbar={<Navigation />}>
      <Section>
        <Container>
          <Message color="success">Thank you for your purchase.</Message>
        </Container>
      </Section>
    </Page>
  );
};
