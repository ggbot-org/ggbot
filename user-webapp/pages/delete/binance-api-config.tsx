import { Button, Section } from "@ggbot2/ui-components";
import { NextPage } from "next";
import { FormEventHandler, useCallback, useMemo } from "react";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbSettings,
  NavigationDangerIcon,
  NavigationLabel,
} from "_components";
import { useApiAction, useGoBack } from "_hooks";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  const goBack = useGoBack();

  const [deleteBinanceApiKey, { isPending }] =
    useApiAction.DeleteBinanceApiConfig();

  const breadcrumbs = useMemo(
    () => [
      {
        content: <NavigationBreadcrumbDashboard isLink />,
      },
      {
        content: <NavigationBreadcrumbSettings isLink />,
      },
      {
        content: <NavigationLabel text="delete Binance API" />,
        current: true,
      },
    ],
    []
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteBinanceApiKey({});
    },
    [isPending, deleteBinanceApiKey]
  );

  return (
    <Content
      topbar={
        <Navigation breadcrumbs={breadcrumbs} icon={<NavigationDangerIcon />} />
      }
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Section header="Delete Binance API key" color="danger">
          <p>Are you sure you want to delete your Binance API key?</p>

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
        </Section>
      </form>
    </Content>
  );
};

export default Page;
