import { Button, ButtonOnClick, Section } from "@ggbot2/design";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import {
  Navigation,
  Page,
  PleasePurchaseSubscription,
  SchedulingsForm,
  StrategyForm,
  StrategyProfits,
} from "_components";
import { StrategyInfo, requireAuthenticationAndGetStrategyInfo, route } from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const StrategyPage: NextPage<ServerSideProps> = ({ strategyKey, whenCreated }) => {
  const router = useRouter();

  const [deleteIsSpinning, setDeleteIsSpinning] = useState(false);
  // TODO use a context with useSubscription hook rather than drill down prop to SchedulingsForm
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | undefined>();

  const onClickDelete = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      setDeleteIsSpinning(true);
      router.push(route.deleteStrategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  return (
    <Page topbar={<Navigation />}>
      {hasActiveSubscription === false ? <PleasePurchaseSubscription /> : null}
      <div>
        <StrategyForm strategyKey={strategyKey} whenCreated={whenCreated} />
        <SchedulingsForm setHasActiveSubscription={setHasActiveSubscription} strategyKey={strategyKey} />
        <StrategyProfits strategyKey={strategyKey} />
      </div>

      <Section>
        <span>Danger zone</span>
        <menu>
          <li>
            <Button color="danger" isLoading={deleteIsSpinning} onClick={onClickDelete}>
              Delete strategy
            </Button>
          </li>
        </menu>
      </Section>
    </Page>
  );
};

export default StrategyPage;
