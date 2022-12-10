import { Button, DateTime, Section, OutputField } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { FormEventHandler, useCallback, useMemo } from "react";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
  NavigationDangerIcon,
  NavigationLabel,
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

  const [deleteStrategy, { isPending }] = useApiAction.DeleteStrategy();

  const breadcrumbs = useMemo(
    () => [
      {
        content: <NavigationBreadcrumbDashboard isLink />,
      },
      {
        content: (
          <NavigationBreadcrumbStrategy strategyKey={strategyKey} isLink />
        ),
      },
      {
        content: <NavigationLabel text="delete strategy" />,
        current: true,
      },
    ],
    [strategyKey]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteStrategy(strategyKey);
    },
    [isPending, deleteStrategy, strategyKey]
  );

  return (
    <Content
      topbar={
        <Navigation breadcrumbs={breadcrumbs} icon={<NavigationDangerIcon />} />
      }
    >
      <div className="p-4">
        {accountIsOwner ? (
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <Section header="Delete strategy">
              <p>Are you sure you want to delete this strategy?</p>

              <OutputField label="name">{name}</OutputField>
              <OutputField label="When created">
                <DateTime format="time" value={whenCreated} />
              </OutputField>

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
            </Section>
          </form>
        ) : (
          <div>Cannot delete strategy. Permission denied!</div>
        )}
      </div>
    </Content>
  );
};

export default Page;
