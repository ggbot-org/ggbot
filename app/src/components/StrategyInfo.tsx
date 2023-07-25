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
import { FormattedMessage, useIntl } from "react-intl";

import { GoCopyStrategy } from "../components/GoCopyStrategy.js";
import { GoEditStrategy } from "../components/GoEditStrategy.js";
import { ShareStrategy } from "../components/ShareStrategy.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { errorMessage, fieldLabel, title } from "../i18n/index.js";

const fields = ["name"] as const;
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const StrategyInfo: FC = () => {
  const { formatMessage } = useIntl();

  const { strategyWhenCreated, strategyKey } = useContext(StrategyContext);

  const formattedWhenCreated = useFormattedDate(strategyWhenCreated, "day");

  const [name, setName] = useState("");
  const [help, setHelp] = useState("");

  const READ = useApi.ReadStrategy();
  const RENAME = useApi.RenameStrategy();

  const isLoading = RENAME.isPending;

  const readOnly = READ.isPending || RENAME.isPending;
  const strategy = READ.data;

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
        if (strategyKey) RENAME.request({ name: newName, ...strategyKey });
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
    if (READ.canRun) READ.request(strategyKey);
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
            label={formatMessage({ id: "fieldLabel.whenCreated" })}
            value={formattedWhenCreated}
          />
        </Column>

        <Column>
          <OutputField
            label={formatMessage({ id: "fieldLabel.strategyId" })}
            value={strategyKey?.strategyId}
          />
        </Column>
      </Columns>

      <Field isGrouped>
        <Control>
          <Button isOutlined isLoading={isLoading}>
            <FormattedMessage id="buttonLabel.save" />
          </Button>
        </Control>
      </Field>

      <Field isGrouped>
        <Control>
          <GoEditStrategy />
        </Control>

        <Control>
          <ShareStrategy />
        </Control>

        <Control>
          <GoCopyStrategy />
        </Control>
      </Field>
    </Form>
  );
};
