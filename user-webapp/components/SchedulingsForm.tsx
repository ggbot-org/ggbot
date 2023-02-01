import {
  StrategyScheduling,
  isAccountStrategy,
  isFrequencyInterval,
} from "@ggbot2/models";
import { isNaturalNumber } from "@ggbot2/type-utils";
import {
  Button,
  InputField,
  InputOnChange,
  Section,
  SelectField,
  SelectOnChange,
} from "@ggbot2/ui-components";
import {
  FC,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApiAction, useSubscription } from "_hooks";
import { StrategyKey } from "_routing";
import { SchedulingsStatusBadge } from "./SchedulingsStatusBadge";
import {SchedulingControllerProps} from './SchedulingController'

type Props = {
  strategyKey: StrategyKey;
  setHasActiveSubscription: (arg: boolean | undefined) => void;
};

export const SchedulingsForm: FC<Props> = ({
  setHasActiveSubscription,
  strategyKey,
}) => {
  const { strategyId } = strategyKey;

  const { hasActiveSubscription } = useSubscription();

  const [read, { data: accountStrategies }] =
    useApiAction.ReadAccountStrategies();
  // const [create, { isPending: createIsPending, data: createData }] =
  //   useApiAction.CreateAccountStrategiesItemScheduling();
  // const [remove, { isPending: removeIsPending, data: removeData }] =
  //   useApiAction.RemoveAccountStrategiesItemSchedulings();

  const [_schedulingChanges, setSchedulingChanges] = useState<
    StrategyScheduling[]
  >([]);

  const disabled = useMemo(
    () => hasActiveSubscription !== true,
    [hasActiveSubscription]
  );

  const schedulings = useMemo<StrategyScheduling[]>(() => {
    const schedulings: StrategyScheduling[] = [];
    if (!Array.isArray(accountStrategies)) return schedulings;
    for (const accountStrategy of accountStrategies)
      if (isAccountStrategy(accountStrategy))
        if (accountStrategy.strategyId === strategyId)
          for (const scheduling of accountStrategy.schedulings)
            schedulings.push(scheduling);
    return schedulings;
  }, [accountStrategies, strategyId]);

  const setScheduling = useCallback<SchedulingControllerProps["setScheduling"]>(
    (scheduling) => {
      setSchedulingChanges((schedulingChanges) =>
        schedulingChanges
          .filter((changedScheduling) => changedScheduling.id !== scheduling.id)
          .concat(scheduling)
      );
    },
    [setSchedulingChanges]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (disabled) return;
    },
    [disabled]
  );

  useEffect(() => {
    if (typeof hasActiveSubscription === "boolean")
      setHasActiveSubscription(hasActiveSubscription);
  }, [hasActiveSubscription, setHasActiveSubscription]);

  // Fetch accountStrategies on mount.
  useEffect(() => {
    const controller = read({});
    return () => {
      controller.abort();
    };
  }, [read]);

  // Fetch accountStrategies on updates.
  useEffect(
    () => {
      // if (createData || removeData) read({});
    },
    [
      /*read, createData, removeData*/
    ]
  );

  return (
    <form onSubmit={onSubmit}>
      <Section header="Schedulings">
        <div>
          <SchedulingsStatusBadge schedulings={schedulings} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {schedulings.map((scheduling) => (
              <SchedulingController
                scheduling={scheduling}
                setScheduling={setScheduling}
              />
            ))}
          </div>

          <menu className="flex flex-row flex-wrap gap-4">
            <li>
              <Button>Add</Button>
            </li>
          </menu>
        </div>

        <menu className="flex flex-row flex-wrap gap-4">
          <li>
            <Button type="submit">Save</Button>
          </li>
        </menu>
      </Section>
    </form>
  );
};

