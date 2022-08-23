import {
  ErrorInvalidName,
  ErrorNameToLong,
  StrategyKey,
  isStrategyKey,
  normalizeName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { Button } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { StrategyItem, StrategyItemProps } from "_components";
import { ApiAction, useApiAction } from "_hooks";
import { route } from "_routing";

type SelectedStrategyKey = StrategyKey | null;
const selectedStrategyKeyStorageKey = "selectedStrategyKey";

const getStoredSelectedStrategy = (): SelectedStrategyKey => {
  const storedValue = global?.sessionStorage?.getItem(
    selectedStrategyKeyStorageKey
  );
  if (!storedValue) return null;
  const objValue = JSON.parse(storedValue);
  return isStrategyKey(objValue) ? objValue : null;
};

type RenamedStrategyItem = Pick<StrategyItemProps, "name" | "strategyId">;

export const Strategies: FC = () => {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedStrategyKey, setSelectedStrategyKey] =
    useState<SelectedStrategyKey>(getStoredSelectedStrategy());

  const [renamedStrategyItems, setRenamedStrategyItems] = useState<
    RenamedStrategyItem[]
  >([]);

  const { data: strategies } = useApiAction.READ_ACCOUNT_STRATEGY_LIST();

  const [renameStrategyIn, setRenameStrategyIn] =
    useState<ApiAction["RENAME_STRATEGY"]["in"]>();
  const { isLoading: renamStrategyIsLoading } =
    useApiAction.RENAME_STRATEGY(renameStrategyIn);

  const onClickNewStrategy = useCallback(() => {
    router.push(route.createStrategyPage());
  }, [router]);

  const strategyItems = useMemo(
    () =>
      strategies
        ?.map(({ name, schedulingStatus, strategyId, strategyKind }) => {
          const isSelected =
            selectedStrategyKey?.strategyId === strategyId &&
            selectedStrategyKey?.strategyKind === strategyKind;

          const onClick: StrategyItemProps["onClick"] = (event) => {
            event.stopPropagation();
            setSelectedStrategyKey({ strategyId, strategyKind });
          };

          const renameIsLoading =
            renameStrategyIn?.strategyId === strategyId &&
            renameStrategyIn.strategyKind === strategyKind &&
            renamStrategyIsLoading;

          const setName: StrategyItemProps["setName"] = (value) => {
            try {
              if (renameIsLoading) return;
              throwIfInvalidName(value);
              const newName = normalizeName(value);
              if (name === newName) return;

              setRenameStrategyIn({ name: newName, strategyId, strategyKind });
              setRenamedStrategyItems((items) =>
                items
                  .filter((item) => item.strategyId !== strategyId)
                  .concat({
                    strategyId,
                    name: newName,
                  })
              );
            } catch (error) {
              if (error instanceof ErrorInvalidName)
                toast.error("Invalid strategy name");
              if (error instanceof ErrorNameToLong)
                toast.error("Strategy name too long");
            }
          };

          return {
            isSelected,
            name,
            onClick,
            renameIsLoading,
            schedulingStatus,
            setName,
            setRenameStrategyIn,
            strategyKind,
            strategyId,
          };
        })
        .map(({ name, strategyId, ...rest }) => {
          const newName = renamedStrategyItems.find(
            (item) => item.strategyId === strategyId
          )?.name;
          return {
            name: newName ?? name,
            strategyId,
            ...rest,
          };
        }),
    [
      renamStrategyIsLoading,
      renameStrategyIn?.strategyId,
      renameStrategyIn?.strategyKind,
      renamedStrategyItems,
      selectedStrategyKey?.strategyId,
      selectedStrategyKey?.strategyKind,
      strategies,
    ]
  );

  const closeSelectedItemOnClick = useCallback(() => {
    if (!selectedStrategyKey) return;
    if (renamStrategyIsLoading) return;
    setSelectedStrategyKey(null);
  }, [renamStrategyIsLoading, selectedStrategyKey, setSelectedStrategyKey]);

  useEffect(() => {
    if (!containerRef.current) return;

    window.addEventListener("click", closeSelectedItemOnClick);

    return () => {
      window.removeEventListener("click", closeSelectedItemOnClick);
    };
  }, [closeSelectedItemOnClick]);

  useEffect(() => {
    if (selectedStrategyKey)
      global?.sessionStorage?.setItem(
        selectedStrategyKeyStorageKey,
        JSON.stringify(selectedStrategyKey)
      );
    else global?.sessionStorage?.removeItem(selectedStrategyKeyStorageKey);
  }, [selectedStrategyKey]);

  return (
    <div ref={containerRef} className="flex flex-col p-4 gap-4">
      <span className="text-xl">strategies</span>
      <menu>
        <Button onClick={onClickNewStrategy}>new strategy</Button>
      </menu>
      <div className="flex flex-col flex-wrap gap-4 md:flex-row">
        {strategyItems?.map(({ strategyId, ...props }) => (
          <StrategyItem key={strategyId} strategyId={strategyId} {...props} />
        ))}
      </div>
    </div>
  );
};
