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
import {
  ButtonShareStrategy,
  Content,
  Navigation,
  NavigationBreadcrumbDashboard,
  NavigationBreadcrumbStrategy,
} from "_components";
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

  const [copyIsSpinning, setCopyIsSpinning] = useState(false);
  const [flowIsSpinning, setFlowIsSpinning] = useState(false);
  const [deleteIsSpinning, setDeleteIsSpinning] = useState(false);

  const someButtonIsSpinning = useMemo(
    () => copyIsSpinning || deleteIsSpinning || flowIsSpinning,
    [copyIsSpinning, deleteIsSpinning, flowIsSpinning]
  );

  const breadcrumbs = useMemo(
    () => [
      <NavigationBreadcrumbDashboard key={1} isLink />,
      <NavigationBreadcrumbStrategy key={2} strategyKey={strategyKey} />,
    ],
    [strategyKey]
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
      if (someButtonIsSpinning) return;
      setFlowIsSpinning(true);
      router.push(route.editFlowPage(strategyKey));
    },
    [someButtonIsSpinning, setFlowIsSpinning, router, strategyKey]
  );

  const onClickCopy = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someButtonIsSpinning) return;
      setCopyIsSpinning(true);
      router.push(route.copyStrategyPage(strategyKey));
    },
    [someButtonIsSpinning, setCopyIsSpinning, router, strategyKey]
  );

  const onClickDelete = useCallback<PointerEventHandler<HTMLButtonElement>>(
    (event) => {
      event.stopPropagation();
      if (someButtonIsSpinning) return;
      setDeleteIsSpinning(true);
      router.push(route.deleteStrategyPage(strategyKey));
    },
    [someButtonIsSpinning, setDeleteIsSpinning, router, strategyKey]
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
    <Content topbar={<Navigation hasSettingsIcon breadcrumbs={breadcrumbs} />}>
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
          <li>
            <Button
              isSpinning={flowIsSpinning}
              onClick={onClickFlow}
              color="primary"
            >
              flow
            </Button>
          </li>
          <li>
            <ButtonShareStrategy {...strategyKey} />
          </li>
          <li>
            <Button isSpinning={copyIsSpinning} onClick={onClickCopy}>
              copy
            </Button>
          </li>
          <li>
            <Button
              isSpinning={deleteIsSpinning}
              onClick={onClickDelete}
              color="danger"
            >
              delete
            </Button>
          </li>
        </menu>
      </div>
    </Content>
  );
};

export default Page;
