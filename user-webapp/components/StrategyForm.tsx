import {
  Box,
  Column,
  Columns,
  Control,
  EditableInputField,
  Field,
  OutputField,
  Title,
  useFormattedDate,
} from "@ggbot2/design";
import { isName, isStrategy, normalizeName } from "@ggbot2/models";
import { FC, useCallback, useEffect, useState } from "react";
import { GoEditStrategyButton } from "_components/GoEditStrategyButton";
import { GoCopyStrategyButton } from "_components/GoCopyStrategyButton";
import { ShareStrategyButton } from "_components/ShareStrategyButton";
import { useApi } from "_hooks/useApi";
import { fieldLabel } from "_i18n";
import { StrategyInfo } from "_routing/types";

type Props = Pick<StrategyInfo, "strategyKey" | "whenCreated">;

export const StrategyForm: FC<Props> = ({ strategyKey, whenCreated }) => {
  const formattedWhenCreated = useFormattedDate(whenCreated, "time");

  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");

  const [RENAME, { isPending: renameIsPending, data: renameData }] =
    useApi.RenameStrategy();

  const [READ, { data: strategy }] = useApi.ReadStrategy();

  const readOnly = !name ? true : renameIsPending;
  const inputNameValue = renameIsPending ? "" : name;
  const inputNamePlaceholder = renameIsPending ? newName : "";

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

  useEffect(() => {
    if (isStrategy(strategy)) setName(strategy.name);
  }, [strategy]);

  useEffect(() => {
    if (renameData) setName(newName);
  }, [renameData, newName]);

  useEffect(() => {
    const controller = READ(strategyKey);
    return () => controller.abort();
  }, [READ, strategyKey]);

  useEffect(() => {
    if (!newName) return;
    if (name === newName) return;
    const controller = RENAME({
      name: newName,
      ...strategyKey,
    });
    return () => controller.abort();
  }, [name, newName, RENAME, strategyKey]);

  return (
    <Box>
      <Title>Strategy info</Title>

      <EditableInputField
        name="name"
        label={fieldLabel.strategyName}
        placeholder={inputNamePlaceholder}
        isSpinning={renameIsPending}
        readOnly={readOnly}
        setValue={inputNameSetValue}
        value={inputNameValue}
      />

      <Columns>
        <Column>
          <OutputField
            label={fieldLabel.whenCreated}
            value={formattedWhenCreated}
          />
        </Column>

        <Column>
          <OutputField
            label={fieldLabel.strategyId}
            value={strategyKey.strategyId}
          />
        </Column>
      </Columns>

      <Field isGrouped>
        <Control>
          <GoEditStrategyButton strategyKey={strategyKey} />
        </Control>

        <Control>
          <ShareStrategyButton strategyKey={strategyKey} strategyName={name} />
        </Control>

        <Control>
          <GoCopyStrategyButton strategyKey={strategyKey} />
        </Control>
      </Field>
    </Box>
  );
};
