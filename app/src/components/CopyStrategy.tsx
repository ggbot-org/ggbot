import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  formValues,
  Message,
  Section,
  Title,
} from "@ggbot2/design";
import { isName } from "@ggbot2/models";
import { FC, useCallback, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { StrategiesQuotaExceededError } from "../components/StrategiesQuotaExceededError.js";
import { StrategyName } from "../components/StrategyName.js";
import { StrategyRecord } from "../components/StrategyRecord.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { useRedirectToNewStrategyPage } from "../hooks/useRedirectToNewStrategyPage.js";

const fields = ["name"];
type Field = (typeof fields)[number];
const fieldName = {
  name: "name",
} as const satisfies Record<string, Field>;

export const CopyStrategy: FC = () => {
  const { strategy } = useContext(StrategyContext);

  const COPY = useApi.CopyStrategy();
  const readOnly = COPY.isPending || COPY.isDone;
  const isLoading = COPY.isPending || COPY.isDone;
  const newStrategy = COPY.data;
  const error = COPY.error;

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (!COPY.canRun) return;
      const { name } = formValues(event, fields);
      if (isName(name))
        COPY.request({
          name,
          strategyId: strategy.id,
          strategyKind: strategy.kind,
        });
    },
    [COPY, strategy]
  );

  useRedirectToNewStrategyPage(newStrategy);

  return (
    <>
      <Form box onSubmit={onSubmit}>
        <Section>
          <Title>
            <FormattedMessage id="CopyStrategy.title" />
          </Title>

          <StrategyRecord strategy={strategy} />
        </Section>

        <Section>
          <Message>
            <FormattedMessage id="CopyStrategy.chooseNewName" />
          </Message>

          <StrategyName
            required
            name={fieldName.name}
            placeholder={strategy.name}
            readOnly={readOnly}
          />

          <Field>
            <Control>
              <Button isLoading={isLoading}>
                <FormattedMessage id="CopyStrategy.button" />
              </Button>
            </Control>
          </Field>
        </Section>
      </Form>

      <StrategiesQuotaExceededError error={error} />
    </>
  );
};
