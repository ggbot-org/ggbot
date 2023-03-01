import { Button, ButtonOnClick, Column, Columns, Container, Section, classNames } from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useCallback, useState } from "react";
import {
  Navigation,
  Page,
  PleasePurchaseSubscription,
  SchedulingsForm,
  StrategyForm,
  StrategyProfits,
} from "_components";
import { StrategyInfo, route } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "whenCreated">;

export const Strategy: FC<Props> = ({ strategyKey, whenCreated }) => {
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
      <Container>
        {hasActiveSubscription === false && (
          <Section>
            <PleasePurchaseSubscription />
          </Section>
        )}
      </Container>

      <Container>
        <Section>
          <Columns>
            <Column>
              <StrategyForm strategyKey={strategyKey} whenCreated={whenCreated} />
            </Column>

            <Column>
              <SchedulingsForm
                setHasActiveSubscription={setHasActiveSubscription}
                strategyKey={strategyKey}
              />
            </Column>
          </Columns>
        </Section>

        <Section>
          <StrategyProfits strategyKey={strategyKey} />
        </Section>

        <Section>
          <Button color="danger" isLoading={deleteIsSpinning} onClick={onClickDelete}>
            Delete strategy
          </Button>
        </Section>
      </Container>
    </Page>
  );
};
