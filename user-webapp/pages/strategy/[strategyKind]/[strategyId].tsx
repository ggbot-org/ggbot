import { isName, normalizeName } from "@ggbot2/models";
import { Button, DateTime, EditableInput } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
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

  const onClickFlow = useCallback(() => {
    router.push(route.editFlowPage(strategyKey));
  }, [router, strategyKey]);

  const onClickCopy = useCallback(() => {
    router.push(route.copyStrategyPage(strategyKey));
  }, [router, strategyKey]);

  const onClickDelete = useCallback(() => {
    router.push(route.deleteStrategyPage(strategyKey));
  }, [router, strategyKey]);

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
          <Button color="primary" onClick={onClickFlow}>
            flow
          </Button>
          <ButtonShareStrategy {...strategyKey} />
          <Button onClick={onClickCopy}>copy</Button>
          <Button color="danger" onClick={onClickDelete}>
            delete
          </Button>
        </menu>
      </div>
    </Content>
  );
};

export default Page;
