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
import { UseActionError } from "@ggbot2/use-action";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { StrategiesErrorExceededQuota } from "../components/StrategiesErrorExceededQuota.js";
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

  const [error, setError] = useState<UseActionError>();

  const COPY = useApi.CopyStrategy();
  const readOnly = COPY.isPending || COPY.isDone;
  const isLoading = COPY.isPending || COPY.isDone;
  const newStrategy = COPY.data;

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

  useEffect(() => {
    if (COPY.error) {
      setError(COPY.error);
      COPY.reset();
    }
  }, [COPY]);

  useRedirectToNewStrategyPage(newStrategy);

  return (
    <Section>
      <Form box onSubmit={onSubmit}>
        <Section>
          <Title>
            <FormattedMessage id="CopyStrategy.title" />
          </Title>

          <Message>
            <FormattedMessage id="CopyStrategy.strategyInfo" />
          </Message>

          <StrategyRecord strategy={strategy} />
        </Section>

        <Section>
          {error ? null : (
            <Message color="info">
              <FormattedMessage id="CopyStrategy.chooseName" />
            </Message>
          )}

          <StrategiesErrorExceededQuota error={error} />

          <StrategyName
            required
            name={fieldName.name}
            placeholder={strategy.name}
            readOnly={readOnly}
          />

          <Field>
            <Control>
              <Button
                isLoading={isLoading}
                color={error ? "warning" : undefined}
              >
                <FormattedMessage id="CopyStrategy.button" />
              </Button>
            </Control>
          </Field>
        </Section>
      </Form>
    </Section>
  );
};
