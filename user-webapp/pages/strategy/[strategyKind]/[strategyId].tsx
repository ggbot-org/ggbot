import { isName, normalizeName } from "@ggbot2/models";
import { Button, DateTime, EditableInput } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { PointerEventHandler, useCallback, useMemo, useState } from "react";
import {
  ButtonShareStrategy,
  Content /*SchedulingStatusBadge*/,
} from "_components";
import { ApiAction, useApiAction } from "_hooks";
import {
  StrategyInfo,
  requireAuthenticationAndGetStrategyInfo,
  route,
} from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const Page: NextPage<ServerSideProps> = ({ strategyKey, whenCreated }) => {
  const router = useRouter();

  const { strategyKind, strategyId } = strategyKey;

  const [copyIsLoading, setCopyIsLoading] = useState(false);
  const [flowIsLoading, setFlowIsLoading] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  const someActionIsLoading = useMemo(
    () =>
      copyIsLoading ||
      deleteIsLoading ||
      flowIsLoading[(copyIsLoading, deleteIsLoading, flowIsLoading)]
  );

  const [renameStrategyIn, setRenameStrategyIn] =
    useState<ApiAction["RENAME_STRATEGY"]["in"]>();
  const { isLoading: renameIsLoading } =
    useApiAction.RENAME_STRATEGY(renameStrategyIn);

  const { data: strategy } = useApiAction.READ_STRATEGY(strategyKey);

  const name = useMemo(() => strategy?.name ?? "", [strategy]);

  const readOnly = useMemo(() => {
    if (!name) return true;
    if (renameIsLoading) return true;
    return false;
  }, [name, renameIsLoading]);

  const onClickFlow = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someActionIsLoading) return;
      setFlowIsLoading(true);
      router.push(route.editFlowPage(strategyKey));
    },
    [someActionIsLoading, setFlowIsLoading, router, strategyKey]
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

  const onClickDelete = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someActionIsLoading) return;
      setDeleteIsLoading(true);
      router.push(route.deleteStrategyPage(strategyKey));
    },
    [someActionIsLoading, setDeleteIsLoading, router, strategyKey]
  );

  const setName = useCallback<(value: unknown) => void>(
    (value) => {
      if (readOnly) return;
      if (!isName(value)) return;
      const newName = normalizeName(value);
      if (name === newName) return;

      setRenameStrategyIn({
        name: newName,
        strategyId,
        strategyKind,
      });
    },
    [name, readOnly, strategyId, strategyKind]
  );

  return (
    <Content>
      <div className="flex flex-col p-4 gap-4">
        <span className="text-xl">strategy</span>
        <dl>
          <dt>created</dt>
          <dd>
            <DateTime format="time" value={whenCreated} />
          </dd>
          <dt>id</dt>
          <dd className="text-xs">{strategyId}</dd>
        </dl>

        <div className="flex items-center justify-between max-w-lg gap-2">
          <div className="w-full">
            <label htmlFor="name">name</label>
            <EditableInput
              id="name"
              isLoading={renameIsLoading}
              readOnly={readOnly}
              setValue={setName}
              value={name}
            />
          </div>
        </div>

        <menu className="flex flex-row overflow-x-scroll gap-4">
          <Button
            isLoading={flowIsLoading}
            onClick={onClickFlow}
            color="primary"
          >
            flow
          </Button>
          <ButtonShareStrategy {...strategyKey} />
          <Button isLoading={copyIsLoading} onClick={onClickCopy}>
            copy
          </Button>
          <Button
            isLoading={deleteIsLoading}
            onClick={onClickDelete}
            color="danger"
          >
            delete
          </Button>
        </menu>
      </div>
    </Content>
  );
};

export default Page;
