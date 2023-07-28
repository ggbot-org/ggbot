import {
  Button,
  Column,
  Columns,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  InputOnChange,
  Title,
} from "@ggbot2/design";
import {
  ErrorInvalidArg,
  isName,
  normalizeName,
  throwIfInvalidName,
} from "@ggbot2/models";
import { FC, useCallback, useContext, useState } from "react";
import { FormattedMessage } from "react-intl";

import { GoCopyStrategy } from "../components/GoCopyStrategy.js";
import { ShareStrategy } from "../components/ShareStrategy.js";
import { StrategyId } from "../components/StrategyId.js";
import { StrategyName } from "../components/StrategyName.js";
import { WhenCreated } from "../components/WhenCreated.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { errorMessage } from "../i18n/index.js";

const fields = ["name"] as const;
const fieldName = {
  name: "name",
} as const satisfies Record<string, (typeof fields)[number]>;

export const StrategyInfo: FC = () => {
  const { strategy } = useContext(StrategyContext);

  const [name, setName] = useState(strategy.name);
  const [help, setHelp] = useState("");

  const RENAME = useApi.RenameStrategy();

  const isLoading = RENAME.isPending;

  const readOnly = RENAME.isPending;

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
        RENAME.request({
          name: newName,
          strategyId: strategy.id,
          strategyKind: strategy.kind,
        });
        setName(newName);
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          setHelp(errorMessage.invalidStrategyName);
      }
    },
    [RENAME, strategy]
  );

  return (
    <Form box onSubmit={onSubmit}>
      <Title>
        <FormattedMessage id="StrategyInfo.title" />
      </Title>

      <StrategyName
        required
        help={help}
        name={fieldName.name}
        onChange={onChangeName}
        readOnly={readOnly}
        value={name}
      />

      <Columns>
        <Column>
          <WhenCreated value={strategy.whenCreated} />
        </Column>

        <Column>
          <StrategyId value={strategy.id} />
        </Column>
      </Columns>

      <Field isGrouped>
        <Control>
          <Button isOutlined isLoading={isLoading}>
            <FormattedMessage id="StrategyInfo.save" />
          </Button>
        </Control>
      </Field>

      <Field isGrouped>
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
