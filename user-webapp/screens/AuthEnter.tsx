import { Column, Columns, Container, Section } from "@ggbot2/design";
import { EmailAddress } from "@ggbot2/models";
import { FC, useMemo, useState } from "react";
import { AuthEnterForm, AuthVerifyForm, Navigation, Page } from "_components";

export const AuthEnter: FC = () => {
  const [email, setEmail] = useState<EmailAddress | undefined>();

  const emailSent = useMemo(() => email !== undefined, [email]);

  return (
    <Page topbar={<Navigation noMenu />}>
      <Container>
        <Section>
          <Columns>
            <Column size="half">
              {email ? (
                <AuthVerifyForm email={email} setEmail={setEmail} />
              ) : (
                <AuthEnterForm emailSent={emailSent} setEmail={setEmail} />
              )}
            </Column>
          </Columns>
        </Section>
      </Container>
    </Page>
  );
};
