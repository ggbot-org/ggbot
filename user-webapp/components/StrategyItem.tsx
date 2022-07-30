import {
  Strategy,
  StrategyKey,
  StrategySchedulingStatus,
} from "@ggbot2/models";
import { Button, EditableInput } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import { FC, SyntheticEvent, useCallback } from "react";
import { SchedulingStatusBadge } from "_components";
import { route } from "_routing";

export type StrategyItemProps = StrategyKey &
  Pick<Strategy, "name"> & {
    isSelected: boolean;
    onClick: (event: SyntheticEvent) => void;
    renameIsLoading?: boolean;
    schedulingStatus: StrategySchedulingStatus;
    setName: (name: Strategy["name"]) => void;
  };

export const StrategyItem: FC<StrategyItemProps> = ({
  isSelected,
  name,
  onClick,
  renameIsLoading,
  schedulingStatus,
  setName,
  ...strategyKey
}) => {
  const router = useRouter();

  const onClickFlow = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      // TODO go to flow editor
      router.push(route.viewFlowPage(strategyKey));
    },
    [router, strategyKey]
  );

  const onClickScheduling = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      router.push(route.scheduleStrategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  const onClickCopy = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      router.push(route.copyStrategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  const onClickDelete = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      router.push(route.deleteStrategyPage(strategyKey));
    },
    [router, strategyKey]
  );

  return (
    <div className="p-2 flex flex-col gap-4 shadow rounded hover:shadow-md transition-all">
      {isSelected ? (
        <>
          <div
            className="p-2 flex flex-row justify-between gap-2 items-center"
            onClick={onClick}
          >
            <EditableInput
              value={name}
              setValue={setName}
              isLoading={renameIsLoading}
            />
            <SchedulingStatusBadge schedulingStatus={schedulingStatus} />
          </div>
          <menu className="p-2 flex flex-row gap-4 overflow-x-scroll">
            <Button color="primary" onClick={onClickFlow}>
              flow
            </Button>
            <Button onClick={onClickScheduling}>scheduling</Button>
            <Button onClick={onClickCopy}>copy</Button>
            <Button color="danger" onClick={onClickDelete}>
              delete
            </Button>
          </menu>
        </>
      ) : (
        <div
          className="flex flex-row justify-between gap-2 items-center"
          onClick={onClick}
        >
          <span className="select-none">{name}</span>
          <SchedulingStatusBadge schedulingStatus={schedulingStatus} />
        </div>
      )}
    </div>
  );
};
