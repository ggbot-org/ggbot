import { Button, Container, FormOnSubmit, Message } from "@ggbot2/design";
import { NextPage } from "next";
import { useCallback } from "react";
import { Navigation, Page } from "_components";
import { useApiAction, useGoBack } from "_hooks";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const DeleteBinanceApiPage: NextPage = () => {
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
      <Container>
        <Message header="Delete Binance API key">
          <p>Are you sure you want to delete your Binance API key?</p>

          <form onSubmit={onSubmit}>
            <menu className="flex flex-row gap-4 justify-between">
              <li>
                <Button type="reset" onClick={goBack}>
                  No, go back...
                </Button>
              </li>
              <li>
                <Button type="submit" color="danger">
                  Yes, delete it!
                </Button>
              </li>
            </menu>
          </form>
        </Message>
      </Container>
    </Page>
  );
};

export default DeleteBinanceApiPage;
