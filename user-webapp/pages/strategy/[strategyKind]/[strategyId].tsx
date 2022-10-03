import { isName, normalizeName } from "@ggbot2/models";
import { Button, DateTime, EditableInput } from "@ggbot2/ui-components";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  PointerEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ButtonShareStrategy, Content, Navigation } from "_components";
import { useApiAction } from "_hooks";
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

  const [copyIsPending, setCopyIsPending] = useState(false);
  const [flowIsPending, setFlowIsPending] = useState(false);
  const [deleteIsPending, setDeleteIsPending] = useState(false);

  const someActionIsPending = useMemo(
    () => copyIsPending || deleteIsPending || flowIsPending,
    [copyIsPending, deleteIsPending, flowIsPending]
  );

  const [renameStrategy, { isPending: renameIsPending }] =
    useApiAction.RENAME_STRATEGY();

  const [readStrategy, { data: strategy }] = useApiAction.READ_STRATEGY();

  const name = useMemo(() => strategy?.name ?? "", [strategy]);

  const readOnly = useMemo(() => {
    if (!name) return true;
    if (renameIsPending) return true;
    return false;
  }, [name, renameIsPending]);

  const onClickFlow = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someActionIsPending) return;
      setFlowIsPending(true);
      router.push(route.editFlowPage(strategyKey));
    },
    [someActionIsPending, setFlowIsPending, router, strategyKey]
  );

  const onClickCopy = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someActionIsPending) return;
      setCopyIsPending(true);
      router.push(route.copyStrategyPage(strategyKey));
    },
    [someActionIsPending, setCopyIsPending, router, strategyKey]
  );

  const onClickDelete = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someActionIsPending) return;
      setDeleteIsPending(true);
      router.push(route.deleteStrategyPage(strategyKey));
    },
    [someActionIsPending, setDeleteIsPending, router, strategyKey]
  );

  const setName = useCallback<(value: unknown) => void>(
    (value) => {
      if (readOnly) return;
      if (!isName(value)) return;
      const newName = normalizeName(value);
      if (name === newName) return;

      renameStrategy({
        data: {
          name: newName,
          strategyId,
          strategyKind,
        },
      });
    },
    [name, readOnly, renameStrategy, strategyId, strategyKind]
  );

  useEffect(() => {
    readStrategy({ data: strategyKey });
  }, [readStrategy, strategyKey]);

  return (
    <Content topbar={<Navigation hasSettingsIcon />}>
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
              isSpinning={renameIsPending}
              readOnly={readOnly}
              setValue={setName}
              value={name}
            />
          </div>
        </div>

        <menu className="flex flex-row flex-wrap gap-4">
          <Button
            isSpinning={flowIsPending}
            onClick={onClickFlow}
            color="primary"
          >
            flow
          </Button>
          <ButtonShareStrategy {...strategyKey} />
          <Button isSpinning={copyIsPending} onClick={onClickCopy}>
            copy
          </Button>
          <Button
            isSpinning={deleteIsPending}
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
