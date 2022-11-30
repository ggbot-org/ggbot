import {
  Button,
  ButtonOnClick,
  DateTime,
  EditableInputField,
  Fieldset,
  OutputField,
} from "@ggbot2/ui-components";
import { isName, isStrategy, normalizeName } from "@ggbot2/models";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ButtonShareStrategy } from "_components";
import { useApiAction } from "_hooks";
import { StrategyInfo, route } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "whenCreated">;

export const StrategyForm: FC<Props> = ({ strategyKey, whenCreated }) => {
  const router = useRouter();

  const [copyIsSpinning, setCopyIsSpinning] = useState(false);
  const [flowIsSpinning, setFlowIsSpinning] = useState(false);
  const [deleteIsSpinning, setDeleteIsSpinning] = useState(false);
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");

  const someButtonIsSpinning = useMemo(
    () => copyIsSpinning || deleteIsSpinning || flowIsSpinning,
    [copyIsSpinning, deleteIsSpinning, flowIsSpinning]
  );
  const [renameStrategy, { isPending: renameIsPending, data: renameData }] =
    useApiAction.RENAME_STRATEGY();

  const [readStrategy, { data: strategy }] = useApiAction.READ_STRATEGY();

  const readOnly = useMemo(() => {
    if (!name) return true;
    if (renameIsPending) return true;
    return false;
  }, [name, renameIsPending]);

  const onClickFlow = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (someButtonIsSpinning) return;
      setFlowIsSpinning(true);
      router.push(route.editFlowPage(strategyKey));
    },
    [someButtonIsSpinning, setFlowIsSpinning, router, strategyKey]
  );

  const onClickCopy = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (someButtonIsSpinning) return;
      setCopyIsSpinning(true);
      router.push(route.copyStrategyPage(strategyKey));
    },
    [someButtonIsSpinning, setCopyIsSpinning, router, strategyKey]
  );

  const onClickDelete = useCallback<ButtonOnClick>(
    (event) => {
      event.stopPropagation();
      if (someButtonIsSpinning) return;
      setDeleteIsSpinning(true);
      router.push(route.deleteStrategyPage(strategyKey));
    },
    [someButtonIsSpinning, setDeleteIsSpinning, router, strategyKey]
  );

  const inputNameSetValue = useCallback<(value: unknown) => void>(
    (value) => {
      if (readOnly) return;
      if (!isName(value)) return;
      const newName = normalizeName(value);
      if (name === newName) return;
      setNewName(newName);
    },
    [name, readOnly]
  );

  const inputNameValue = useMemo(() => {
    if (renameIsPending) return "";
    return name;
  }, [name, renameIsPending]);

  const inputNamePlaceholder = useMemo(() => {
    if (renameIsPending) return newName;
    return "";
  }, [newName, renameIsPending]);

  useEffect(() => {
    if (isStrategy(strategy)) setName(strategy.name);
  }, [strategy]);

  useEffect(() => {
    if (renameData) setName(newName);
  }, [renameData, newName]);

  useEffect(() => readStrategy(strategyKey), [readStrategy, strategyKey]);

  useEffect(() => {
    if (!newName) return;
    if (name === newName) return;
    return renameStrategy({
      name: newName,
      ...strategyKey,
    });
  }, [name, newName, renameStrategy, strategyKey]);

  return (
    <Fieldset legend={<span className="text-xl">strategy</span>}>
      <EditableInputField
        name="name"
        label="name"
        placeholder={inputNamePlaceholder}
        isSpinning={renameIsPending}
        readOnly={readOnly}
        setValue={inputNameSetValue}
        value={inputNameValue}
      />

      <OutputField label="When created">
        <DateTime format="time" value={whenCreated} />
      </OutputField>

      <OutputField label="Strategy id">
        <span className="text-xs">{strategyKey.strategyId}</span>
      </OutputField>

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
    </Fieldset>
  );
};
