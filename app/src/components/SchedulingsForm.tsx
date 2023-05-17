import {
  SchedulingItem,
  SchedulingItemProps,
} from "_components/SchedulingItem";
import { SchedulingsStatusBadges } from "_components/SchedulingsStatusBadges";
import { useApi } from "_hooks/useApi";
import { useSubscription } from "_hooks/useSubscription";
import { StrategyKey } from "_routing/types";
import {
  Button,
  ButtonOnClick,
  Control,
  Field,
  Form,
  FormOnSubmit,
  Level,
  LevelItem,
  Title,
} from "@ggbot2/design";
import {
  isAccountStrategy,
  isStrategyScheduling,
  newStrategyScheduling,
  StrategyScheduling,
} from "@ggbot2/models";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

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

  const [READ, { data: accountStrategies }] = useApi.ReadAccountStrategies();
  const [WRITE, { isPending: writeIsPending, data: writeData }] =
    useApi.WriteAccountStrategiesItemSchedulings();

  const [schedulingItems, setSchedulingItems] = useState<
    SchedulingItemProps["scheduling"][]
  >([]);

  const currentSchedulings = useMemo<StrategyScheduling[]>(() => {
    if (!Array.isArray(accountStrategies)) return [];
    const schedulings: StrategyScheduling[] = [];
    for (const accountStrategy of accountStrategies) {
      if (!isAccountStrategy(accountStrategy)) continue;
      if (accountStrategy.strategyId !== strategyId) continue;
      schedulings.push(...accountStrategy.schedulings);
    }
    return schedulings;
  }, [accountStrategies, strategyId]);

  const someSchedulingChanged = useMemo(() => {
    // Do not know about currentSchedulings yet, data fetch is pending.
    if (!currentSchedulings) return false;
    // Some scheduling for sure was added or removed.
    if (schedulingItems.length !== currentSchedulings.length) return true;
    // Here the number of schedulingItem and currentSchedulings is the same.
    // Check every schedulingItem:
    for (const schedulingItem of schedulingItems) {
      const currentScheduling = currentSchedulings.find(
        ({ id }) => schedulingItem.id === id
      );
      // if there is no corresponding currentScheduling, it is a new item;
      if (!currentScheduling) return true;
      // check if schedulingItem is valid, and some of its attribute changed.
      if (
        isStrategyScheduling(schedulingItem) &&
        (schedulingItem.status !== currentScheduling.status ||
          schedulingItem.frequency.every !==
            currentScheduling.frequency.every ||
          schedulingItem.frequency.interval !==
            currentScheduling.frequency.interval)
      )
        return true;
    }
    return false;
  }, [currentSchedulings, schedulingItems]);

  const canCancel = someSchedulingChanged;

  const wantedSchedulings = useMemo<StrategyScheduling[]>(
    () => schedulingItems.filter(isStrategyScheduling),
    [schedulingItems]
  );

  const canSubmit = useMemo(() => {
    if (hasActiveSubscription !== true) return false;
    return someSchedulingChanged && schedulingItems.every(isStrategyScheduling);
  }, [someSchedulingChanged, hasActiveSubscription, schedulingItems]);

  const setSchedulingItemFrequency = useCallback<
    (id: StrategyScheduling["id"]) => SchedulingItemProps["setFrequency"]
  >(
    (id) => (frequency) => {
      setSchedulingItems((schedulingItems) =>
        schedulingItems.map((schedulingItem) => {
          if (schedulingItem.id !== id) return schedulingItem;
          return { ...schedulingItem, frequency };
        })
      );
    },
    []
  );

  const setSchedulingItemStatus = useCallback<
    (id: StrategyScheduling["id"]) => SchedulingItemProps["setStatus"]
  >(
    (id) => (status) => {
      setSchedulingItems((schedulingItems) =>
        schedulingItems.map((schedulingItem) => {
          if (schedulingItem.id !== id) return schedulingItem;
          return { ...schedulingItem, status };
        })
      );
    },
    []
  );

  const removeSchedulingItem = useCallback<
    (id: StrategyScheduling["id"]) => SchedulingItemProps["removeScheduling"]
  >(
    (id) => () => {
      setSchedulingItems((schedulingItems) =>
        schedulingItems.filter((schedulingItem) => schedulingItem.id !== id)
      );
    },
    []
  );

  const addSchedulingItem = useCallback(() => {
    setSchedulingItems((schedulingItems) =>
      schedulingItems.concat(
        newStrategyScheduling({
          frequency: { every: 1, interval: "1h" },
          status: "inactive",
        })
      )
    );
  }, []);

  const onClickSave = useCallback<ButtonOnClick>(() => {
    if (!canSubmit) return;
    WRITE({ strategyId, schedulings: wantedSchedulings });
  }, [canSubmit, strategyId, wantedSchedulings, WRITE]);

  const onSubmit = useCallback<FormOnSubmit>((event) => {
    event.preventDefault();
  }, []);

  const onClickCancel = useCallback<ButtonOnClick>(
    (event) => {
      event.preventDefault();
      setSchedulingItems(currentSchedulings);
    },
    [currentSchedulings]
  );

  useEffect(() => {
    if (typeof hasActiveSubscription === "boolean")
      setHasActiveSubscription(hasActiveSubscription);
  }, [hasActiveSubscription, setHasActiveSubscription]);

  // Fetch accountStrategies on mount.
  useEffect(() => {
    const controller = READ({});
    return () => controller.abort();
  }, [READ]);

  // Update schedulings once fetched.
  useEffect(() => {
    if (currentSchedulings) setSchedulingItems(currentSchedulings);
  }, [currentSchedulings]);

  // Fetch accountStrategies on updates.
  useEffect(() => {
    if (writeData) READ({});
  }, [writeData, READ]);

  return (
    <Form box onSubmit={onSubmit}>
      <Level
        isMobile
        left={
          <LevelItem>
            <Title>Schedulings</Title>
          </LevelItem>
        }
        right={
          <LevelItem>
            <SchedulingsStatusBadges schedulings={currentSchedulings} />
          </LevelItem>
        }
      />

      {schedulingItems.map((scheduling) => {
        const { id } = scheduling;
        return (
          <SchedulingItem
            key={id}
            scheduling={scheduling}
            setFrequency={setSchedulingItemFrequency(id)}
            setStatus={setSchedulingItemStatus(id)}
            removeScheduling={removeSchedulingItem(id)}
          />
        );
      })}

      <Field>
        <Control>
          <Button onClick={addSchedulingItem} size="small">
            Add
          </Button>
        </Control>
      </Field>

      <Field isGrouped>
        <Control>
          <Button
            onClick={onClickSave}
            disabled={!canSubmit}
            isLoading={writeIsPending}
          >
            Save
          </Button>
        </Control>

        <Control>
          <Button onClick={onClickCancel} disabled={!canCancel}>
            Cancel
          </Button>
        </Control>
      </Field>
    </Form>
  );
};
