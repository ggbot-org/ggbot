import { Button, DateTime, Icon } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { FormEventHandler, useCallback, useMemo } from "react";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
  NavigationBreadcrumbLabel,
} from "_components";
import { useApiAction, useGoBack } from "_hooks";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({
  accountIsOwner,
  strategyKey,
  name,
  whenCreated,
}) => {
  const goBack = useGoBack();

  const [deleteStrategy, { isPending }] = useApiAction.DELETE_STRATEGY();

  const breadcrumbs = useMemo(
    () => [
      <NavigationBreadcrumbDashboard key={1} isLink />,
      <NavigationBreadcrumbStrategy key={2} strategyKey={strategyKey} isLink />,
      <div key={3} className="flex flex-row gap-2 items-center">
        <NavigationBreadcrumbLabel text="delete" />
        <span className="text-danger-400">
          <Icon name="danger" size={17} />
        </span>
      </div>,
    ],
    [strategyKey]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteStrategy({ data: strategyKey });
    },
    [isPending, deleteStrategy, strategyKey]
  );

  return (
    <Content topbar={<Navigation breadcrumbs={breadcrumbs} hasSettingsIcon />}>
      <div className="p-4">
        {accountIsOwner ? (
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <span className="text-xl">delete strategy</span>
            <p>Are you sure you want to delete this strategy?</p>
            <div className="p-4 shadow">
              <dl>
                <dt>name</dt>
                <dd>{name}</dd>
                <dt>created</dt>
                <dd>
                  <DateTime format="time" value={whenCreated} />
                </dd>
              </dl>
            </div>
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
        ) : (
          <div>Cannot delete strategy. Permission denied!</div>
        )}
      </div>
    </Content>
  );
};

export default Page;
