import { Button, ButtonOnClick, Column, Columns, Control, Field, Message, Section } from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useCallback, useState } from "react";
import { ButtonGoSettings, SchedulingsForm, StrategyForm, StrategyProfits } from "_components";
import { PageLayout } from "_layouts";
import { StrategyInfo, route } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "whenCreated">;

export const StrategyPage: FC<Props> = ({ strategyKey, whenCreated }) => {
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
    <PageLayout>
      {hasActiveSubscription === false && (
        /* TODO use a modal here */
        <>
          <Message color="warning">
            <p>You cannot run a strategy without a subscription.</p>

            <p>
              Please go to <em>Settings</em> and <b>purchase</b> a subscription.
            </p>
          </Message>

          <Field>
            <Control>
              <ButtonGoSettings section="billing" />
            </Control>
          </Field>
        </>
      )}

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
    </PageLayout>
  );
};