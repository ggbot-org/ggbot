import {
  Box,
  Column,
  Columns,
  Control,
  EditableInputField,
  Field,
  InputField,
  Title,
  useFormattedDate,
} from "@ggbot2/design";
import { isName, isStrategy, normalizeName } from "@ggbot2/models";
import { FC, useCallback, useEffect, useState } from "react";
import { ShareStrategyButton } from "_components";
import { useApiAction } from "_hooks";
import { fieldLabel } from "_i18n";
import { StrategyInfo } from "_routing";
import { GoEditStrategyButton } from "./GoEditStrategyButton";
import { GoCopyStrategyButton } from "./GoCopyStrategyButton";

type Props = Pick<StrategyInfo, "strategyKey" | "whenCreated">;

export const StrategyForm: FC<Props> = ({ strategyKey, whenCreated }) => {
  const formattedWhenCreated = useFormattedDate(whenCreated, "time");

  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");

  const [renameStrategy, { isPending: renameIsPending, data: renameData }] =
    useApiAction.RenameStrategy();

  const [readStrategy, { data: strategy }] = useApiAction.ReadStrategy();

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
          <InputField
            label={fieldLabel.whenCreated}
            defaultValue={formattedWhenCreated}
            readOnly
          />
        </Column>

        <Column>
          <InputField
            label={fieldLabel.strategyId}
            defaultValue={strategyKey.strategyId}
            readOnly
          />
        </Column>
      </Columns>

      <Field isGrouped>
        <Control>
          <GoEditStrategyButton strategyKey={strategyKey} />
        </Control>

        <Control>
          <ShareStrategyButton strategyKey={strategyKey} />
        </Control>

        <Control>
          <GoCopyStrategyButton strategyKey={strategyKey} />
        </Control>
      </Field>
    </Box>
  );
};
