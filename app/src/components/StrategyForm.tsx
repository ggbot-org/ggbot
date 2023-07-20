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
import { FC, useCallback, useContext, useEffect, useState } from "react";

import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { buttonLabel, errorMessage, fieldLabel, title } from "../i18n/index.js";
import { GoCopyStrategyButton } from "./GoCopyStrategyButton.js";
import { GoEditStrategyButton } from "./GoEditStrategyButton.js";
import { ShareStrategyButton } from "./ShareStrategyButton.js";

const fields = ["name"] as const;
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const StrategyForm: FC = () => {
  const { strategyWhenCreated, strategyKey } = useContext(StrategyContext);

  const formattedWhenCreated = useFormattedDate(strategyWhenCreated, "day");

  const [name, setName] = useState("");
  const [help, setHelp] = useState("");

  const { request: RENAME, isPending: renameIsPending } =
    useApi.RenameStrategy();

  const {
    request: READ,
    data: strategy,
    isPending: readIsPending,
  } = useApi.ReadStrategy();

  const readOnly = readIsPending || renameIsPending;

  const onChangeName = useCallback<InputOnChange>((event) => {
    const value = event.target.value;
    if (!isName(value)) return;
    setName(value);
  }, []);

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      try {
        const { name } = formValues(event, fields);
        if (!isName(name)) return;
        const newName = normalizeName(name);
        throwIfInvalidName(newName);
        if (strategyKey) RENAME({ name: newName, ...strategyKey });
        setName(newName);
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          setHelp(errorMessage.invalidStrategyName);
      }
    },
    [RENAME, strategyKey]
  );

  // Read strategy data.
  useEffect(() => {
    if (!strategyKey) return;
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
            value={strategyKey?.strategyId}
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
          <GoEditStrategyButton />
        </Control>

        <Control>
          <ShareStrategyButton />
        </Control>

        <Control>
          <GoCopyStrategyButton />
        </Control>
      </Field>
    </Form>
  );
};
