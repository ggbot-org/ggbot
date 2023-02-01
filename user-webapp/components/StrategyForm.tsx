import {
  Button,
  ButtonOnClick,
  DateTime,
  EditableInputField,
  Section,
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
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");

  const someButtonIsSpinning = useMemo(
    () => copyIsSpinning || flowIsSpinning,
    [copyIsSpinning, flowIsSpinning]
  );
  const [renameStrategy, { isPending: renameIsPending, data: renameData }] = useApiAction.RenameStrategy();

  const [readStrategy, { data: strategy }] = useApiAction.ReadStrategy();

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

  useEffect(() => {
    const controller = readStrategy(strategyKey);
    return () => {
      controller.abort();
    };
  }, [readStrategy, strategyKey]);

  useEffect(() => {
    if (!newName) return;
    if (name === newName) return;
    const controller = renameStrategy({
      name: newName,
      ...strategyKey,
    });
    return () => {
      controller.abort();
    };
  }, [name, newName, renameStrategy, strategyKey]);

  return (
    <Section header="Strategy">
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
        <code>{strategyKey.strategyId}</code>
      </OutputField>

      <menu className="flex flex-row flex-wrap gap-4">
        <li>
          <Button isSpinning={flowIsSpinning} onClick={onClickFlow} color="primary">
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
      </menu>
    </Section>
  );
};
