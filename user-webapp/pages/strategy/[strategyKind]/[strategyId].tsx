import { Button, ButtonOnClick, Section } from "@ggbot2/ui-components";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import {
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
  NavigationSettingsIcon,
  PleasePurchaseSubscription,
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
  const [hasActiveSubscription, setHasActiveSubscription] = useState<
    boolean | undefined
  >();

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
      message={
        hasActiveSubscription === false ? <PleasePurchaseSubscription /> : null
      }
    >
      <div className="flex flex-wrap gap-2">
        <StrategyForm strategyKey={strategyKey} whenCreated={whenCreated} />
        <SchedulingsForm
          setHasActiveSubscription={setHasActiveSubscription}
          strategyKey={strategyKey}
        />
        <StrategyProfits strategyKey={strategyKey} />
      </div>

      <Section color="danger" header="Danger zone">
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
      </Section>
    </Content>
  );
};

export default Page;
