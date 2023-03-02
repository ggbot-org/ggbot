import { Container, Message, Section } from "@ggbot2/design";
import { FC } from "react";
import { Navigation, Page } from "_components";

export const SubscriptionCanceled: FC = () => {
  return (
    <Page topbar={<Navigation />}>
      <Section>
        <Container>
          <Message color="warning">Your purchase was canceled.</Message>
        </Container>
      </Section>
    </Page>
  );
};
