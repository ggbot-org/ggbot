import { Button } from "@ggbot2/ui-components";
import type { NextPage } from "next";
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

  const [deleteAccount, { isPending }] = useApiAction.DeleteAccount();

  const breadcrumbs = useMemo(
    () => [
      {
        content: <NavigationBreadcrumbDashboard isLink />,
      },
      {
        content: <NavigationBreadcrumbSettings isLink />,
      },
      {
        content: <NavigationLabel text="delete account" />,
        current: true,
      },
    ],
    []
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteAccount({});
    },
    [isPending, deleteAccount]
  );

  return (
    <Content
      topbar={
        <Navigation breadcrumbs={breadcrumbs} icon={<NavigationDangerIcon />} />
      }
    >
      <div className="p-4">
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <span className="text-xl">Delete account</span>
          <p>Are you sure you want to delete this account?</p>
          <menu className="flex flex-row gap-4">
            <li>
              <Button type="reset" onClick={goBack}>
                no, go back
              </Button>
            </li>
            <li>
              <Button type="submit" color="danger">
                yes, delete it
              </Button>
            </li>
          </menu>
        </form>
      </div>
    </Content>
  );
};

export default Page;