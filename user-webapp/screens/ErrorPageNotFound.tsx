import { Button, Control, Container, Field, Section, classNames } from "@ggbot2/design";
import { FC } from "react";
import { Page, Navigation } from "_components";
import { useGoBack } from "_hooks";

export const ErrorPageNotFound: FC = () => {
  const goBack = useGoBack();

  return (
    <Page topbar={<Navigation />}>
      <Section>
        <Container isFluid>
          <p className={classNames("title")}>Page not found</p>

          <Field>
            <Control>
              <Button onClick={goBack}>Go back</Button>
            </Control>
          </Field>
        </Container>
      </Section>
    </Page>
  );
};
