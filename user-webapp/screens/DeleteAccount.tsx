import {
  Button,
  Container,
  Control,
  Field,
  FormOnSubmit,
  Message,
  Section,
  classNames,
} from "@ggbot2/design";
import { FC, useCallback } from "react";
import { Navigation, Page } from "_components";
import { useApiAction, useGoBack } from "_hooks";

export const DeleteAccount: FC = () => {
  const goBack = useGoBack();

  const [deleteAccount, { isPending }] = useApiAction.DeleteAccount();

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteAccount({});
    },
    [isPending, deleteAccount]
  );

  return (
    <Page topbar={<Navigation />}>
      <Section>
        <Container maxWidth="desktop">
          <h1 className={classNames("title")}>Account deletion</h1>
          <Message color="danger" header={<>&nbsp;</>}>
            <p className={classNames("block")}>Are you sure you want to delete your account?</p>
            <form onSubmit={onSubmit}>
              <Field isGrouped>
                <Control>
                  <Button type="reset" onClick={goBack}>
                    No, go back...
                  </Button>
                </Control>
                <Control>
                  <Button type="submit" color="danger">
                    Yes, delete it!
                  </Button>
                </Control>
              </Field>
            </form>
          </Message>
        </Container>
      </Section>
    </Page>
  );
};
