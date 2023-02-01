import {
  AccountStrategy,
  isAccountStrategy,
  isName,
  isStrategyKey,
} from "@ggbot2/models";
import { isMaybeObject } from "@ggbot2/type-utils";
import { Button, ButtonOnClick } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useApiAction } from "_hooks";
import { route } from "_routing";
import { SchedulingsStatusBadge } from "./SchedulingsStatusBadge";
import { StrategyItem } from "./StrategyItem";

export const Strategies: FC = () => {
  const router = useRouter();

  const [newStrategyIsLoading, setNewStrategyIsLoading] = useState(false);

  const [readStrategies, { data: strategies }] =
    useApiAction.ReadAccountStrategies();

  const onClickNewStrategy = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (newStrategyIsLoading) return;
      router.push(route.createStrategyPage());
      setNewStrategyIsLoading(true);
    },
    [newStrategyIsLoading, setNewStrategyIsLoading, router]
  );

  const noStrategy = useMemo(() => strategies === null, [strategies]);

  const { strategyItems, unknownItems } = useMemo(() => {
    const unknownItems: unknown[] = [];
    const strategyItems: Pick<
      AccountStrategy,
      "name" | "strategyId" | "strategyKind" | "schedulings"
    >[] = [];
    if (Array.isArray(strategies))
      for (const item of strategies) {
        if (isAccountStrategy(item)) {
          strategyItems.push(item);
          continue;
        }
        if (isMaybeObject<AccountStrategy>(item)) {
          // Handle unknown schedulings.
          const { name, strategyKind, strategyId } = item;
          const strategyKey = { strategyKind, strategyId };
          if (isName(name) && isStrategyKey(strategyKey)) {
            strategyItems.push({ name, schedulings: [], ...strategyKey });
            continue;
          }
        }
        unknownItems.push(item);
      }
    return { strategyItems, unknownItems };
  }, [strategies]);

  useEffect(() => {
    const controller = readStrategies({});
    return () => {
      controller.abort();
    };
  }, [readStrategies]);

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl">strategies</h2>
        <menu>
          <li>
            <Button
              isSpinning={newStrategyIsLoading}
              onClick={onClickNewStrategy}
            >
              new strategy
            </Button>
          </li>
        </menu>
      </div>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
        {noStrategy && <p>Your strategy list is empty.</p>}
        {strategyItems.map(
          ({ name, strategyId, strategyKind, schedulings }) => (
            <div className="lg:max-w-lg" key={strategyId}>
              <StrategyItem strategyKey={{ strategyId, strategyKind }}>
                <span>{name}</span>
                <SchedulingsStatusBadge schedulings={schedulings} />
              </StrategyItem>
            </div>
          )
        )}
      </div>
      {unknownItems.length > 0 ? (
        <div>
          <div>unknown items</div>
          <pre>
            <code>{JSON.stringify(unknownItems, null, 2)}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
};
