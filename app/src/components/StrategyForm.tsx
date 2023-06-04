import {
  Button,
  Column,
  Columns,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  InputField,
  InputOnChange,
  OutputField,
  Title,
  useFormattedDate,
} from "@ggbot2/design";
import {
  ErrorInvalidArg,
  isName,
  isStrategy,
  normalizeName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { FC, useCallback, useEffect, useState } from "react";

import { useApi } from "../hooks/useApi.js";
import { buttonLabel, errorMessage, fieldLabel, title } from "../i18n/index.js";
import { StrategyInfo } from "../routing/types.js";
import { GoCopyStrategyButton } from "./GoCopyStrategyButton.js";
import { GoEditStrategyButton } from "./GoEditStrategyButton.js";
import { ShareStrategyButton } from "./ShareStrategyButton.js";

type Props = Pick<StrategyInfo, "strategyKey" | "whenCreated">;

const fields = ["name"] as const;
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const StrategyForm: FC<Props> = ({ strategyKey, whenCreated }) => {
  const formattedWhenCreated = useFormattedDate(whenCreated, "day");

  const [name, setName] = useState("");
  const [help, setHelp] = useState("");

  const [RENAME, { isPending: renameIsPending }] = useApi.RenameStrategy();

  const [READ, { data: strategy, isPending: readIsPending }] =
    useApi.ReadStrategy();

  const readOnly = readIsPending || renameIsPending;

  const onChangeName = useCallback<InputOnChange>((event) => {
    const value = event.target.value;
    if (!isName(value)) return;
    setName(value);
  }, []);

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (renameIsPending) return;
      try {
        const { name } = formValues(event, fields);
        if (!isName(name)) return;
        const newName = normalizeName(name);
        throwIfInvalidName(newName);
        RENAME({ name: newName, ...strategyKey });
        setName(newName);
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          setHelp(errorMessage.invalidStrategyName);
      }
    },
    [RENAME, renameIsPending, strategyKey]
  );

  // Read strategy data.
  useEffect(() => {
    const controller = READ(strategyKey);
    return () => controller.abort();
  }, [READ, strategyKey]);

  // Set name on READ.
  useEffect(() => {
    if (isStrategy(strategy)) setName(strategy.name);
  }, [strategy]);

  return (
    <Form box onSubmit={onSubmit}>
      <Title>{title.strategyInfo}</Title>

      <InputField
        required
        label={fieldLabel.strategyName}
        help={help}
        name={fieldName.name}
        onChange={onChangeName}
        readOnly={readOnly}
        value={name}
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
          <Button isOutlined isLoading={renameIsPending}>
            {buttonLabel.save}
          </Button>
        </Control>
      </Field>

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
    </Form>
  );
};
