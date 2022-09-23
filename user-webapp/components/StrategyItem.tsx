import {
  Strategy,
  StrategyKey,
  StrategySchedulingStatus,
} from "@ggbot2/models";
import { Button, EditableInput } from "@ggbot2/ui-components";
import { useRouter } from "next/router";
import {
  FC,
  PointerEventHandler,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
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

  const [copyIsLoading, setCopyIsLoading] = useState(false);
  const [flowIsLoading, setFlowIsLoading] = useState(false);
  const [manageIsLoading, setManageIsLoading] = useState(false);

  const someActionIsLoading = useMemo(
    () => copyIsLoading || flowIsLoading || manageIsLoading,
    [copyIsLoading, flowIsLoading, manageIsLoading]
  );

  const onClickCopy = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someActionIsLoading) return;
      setCopyIsLoading(true);
      router.push(route.copyStrategyPage(strategyKey));
    },
    [someActionIsLoading, setCopyIsLoading, router, strategyKey]
  );

  const onClickFlow = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someActionIsLoading) return;
      setFlowIsLoading(true);
      router.push(route.editFlowPage(strategyKey));
    },
    [someActionIsLoading, setFlowIsLoading, router, strategyKey]
  );

  const onClickManage = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someActionIsLoading) return;
      setManageIsLoading(true);
      router.push(route.strategyPage(strategyKey));
    },
    [someActionIsLoading, setManageIsLoading, router, strategyKey]
  );

  return (
    <div className="w-fit flex flex-col gap-4 p-2 rounded shadow transition-all hover:shadow-md">
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
            <Button
              isLoading={flowIsLoading}
              onClick={onClickFlow}
              color="primary"
            >
              flow
            </Button>
            <Button isLoading={manageIsLoading} onClick={onClickManage}>
              manage
            </Button>
            <Button isLoading={copyIsLoading} onClick={onClickCopy}>
              copy
            </Button>
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
