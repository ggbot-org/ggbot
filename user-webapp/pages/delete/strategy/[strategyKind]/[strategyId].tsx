import { Button, DateTime, Section, OutputField } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useCallback, useEffect, useMemo } from "react";
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
  route,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({
  accountIsOwner,
  strategyKey,
  name,
  whenCreated,
}) => {
  const router = useRouter();

  const goBack = useGoBack();

  const [deleteStrategy, { isPending, data: whenDeleted }] =
    useApiAction.DeleteStrategy();

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
        content: <NavigationLabel text="delete" />,
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

  useEffect(() => {
    if (!whenDeleted) return;
    router.push(route.homePage());
  }, [router, whenDeleted]);

  return (
    <Content
      topbar={
        <Navigation breadcrumbs={breadcrumbs} icon={<NavigationDangerIcon />} />
      }
    >
      {accountIsOwner ? (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Section header="Delete strategy" color="danger">
            <p>Are you sure you want to delete this strategy?</p>

            <OutputField label="name">{name}</OutputField>
            <OutputField label="when created">
              <DateTime format="time" value={whenCreated} />
            </OutputField>

            <menu className="flex flex-row gap-4 justify-between">
              <li>
                <Button type="reset" onClick={goBack}>
                  no, go back
                </Button>
              </li>
              <li>
                <Button type="submit" color="danger" isSpinning={isPending}>
                  yes, delete it
                </Button>
              </li>
            </menu>
          </Section>
        </form>
      ) : (
        <div>Cannot delete strategy. Permission denied!</div>
      )}
    </Content>
  );
};

export default Page;
