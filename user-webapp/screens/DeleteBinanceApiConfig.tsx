import { Button, Container, Control, Field, FormOnSubmit, Message, Section } from "@ggbot2/design";
import { FC, useCallback } from "react";
import { Navigation, Page } from "_components";
import { useApiAction, useGoBack } from "_hooks";

export const DeleteBinanceApiConfig: FC = () => {
  const goBack = useGoBack();

  const [deleteBinanceApiKey, { isPending }] = useApiAction.DeleteBinanceApiConfig();

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteBinanceApiKey({});
    },
    [isPending, deleteBinanceApiKey]
  );

  return (
    <Page topbar={<Navigation />}>
      <Section>
        <Container>
          <Message header="Delete Binance API key">
            <p>Are you sure you want to delete your Binance API key?</p>

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
