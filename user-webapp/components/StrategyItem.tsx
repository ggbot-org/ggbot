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
    setName: (value: string) => void;
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

  const onClickFlow = useCallback(() => {
    router.push(route.editFlowPage(strategyKey));
  }, [router, strategyKey]);

  const onClickManage = useCallback(() => {
    router.push(route.strategyPage(strategyKey));
  }, [router, strategyKey]);

  const onClickCopy = useCallback(() => {
    router.push(route.copyStrategyPage(strategyKey));
  }, [router, strategyKey]);

  return (
    <div className="flex flex-col p-2 rounded shadow gap-4 transition-all hover:shadow-md">
      {isSelected ? (
        <>
          <div
            className="flex flex-row items-center justify-between p-2 gap-2"
            onClick={onClick}
          >
            <EditableInput
              value={name}
              setValue={setName}
              isLoading={renameIsLoading}
            />
            <SchedulingStatusBadge schedulingStatus={schedulingStatus} />
          </div>
          <menu className="flex flex-row p-2 overflow-x-scroll gap-4">
            <Button color="primary" onClick={onClickFlow}>
              flow
            </Button>
            <Button onClick={onClickManage}>manage</Button>
            <Button onClick={onClickCopy}>copy</Button>
          </menu>
        </>
      ) : (
        <div
          className="flex flex-row items-center justify-between gap-2"
          onClick={onClick}
        >
          <span className="select-none">{name}</span>
          <SchedulingStatusBadge schedulingStatus={schedulingStatus} />
        </div>
      )}
    </div>
  );
};
