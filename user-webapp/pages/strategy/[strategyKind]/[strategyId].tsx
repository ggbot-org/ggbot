import { Button, ButtonOnClick, Fieldset } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
  NavigationSettingsIcon,
  SchedulingsForm,
  StrategyForm,
  StrategyProfits,
} from "_components";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
  route,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ strategyKey, whenCreated }) => {
  const router = useRouter();

  const [deleteIsSpinning, setDeleteIsSpinning] = useState(false);

  const breadcrumbs = useMemo(
    () => [
      {
        content: <NavigationBreadcrumbDashboard isLink />,
      },
      {
        content: <NavigationBreadcrumbStrategy strategyKey={strategyKey} />,
        current: true,
      },
    ],
    [strategyKey]
  );

  const onClickDelete = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      setDeleteIsSpinning(true);
      router.push(route.deleteStrategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  return (
    <Content
      topbar={
        <Navigation
          breadcrumbs={breadcrumbs}
          icon={<NavigationSettingsIcon />}
        />
      }
    >
      <div className="flex flex-wrap gap-2">
        <StrategyForm strategyKey={strategyKey} whenCreated={whenCreated} />
        <SchedulingsForm strategyKey={strategyKey} />
        <StrategyProfits strategyKey={strategyKey} />
      </div>

      <Fieldset color="danger" legend="Danger zone">
        <menu>
          <li>
            <Button
              color="danger"
              isSpinning={deleteIsSpinning}
              onClick={onClickDelete}
            >
              Delete strategy
            </Button>
          </li>
        </menu>
      </Fieldset>
    </Content>
  );
};

export default Page;
