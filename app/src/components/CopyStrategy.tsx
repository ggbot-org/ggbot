import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  InputField,
  Message,
  Section,
  Title,
  useToast,
} from "@ggbot2/design";
import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import {
  ChangeEventHandler,
  FC,
  useCallback,
  useContext,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StrategiesQuotaExceededError } from "../components/StrategiesQuotaExceededError.js";
import { StrategyRecord } from "../components/StrategyRecord.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { useRedirectToNewStrategyPage } from "../hooks/useRedirectToNewStrategyPage.js";

export const CopyStrategy: FC = () => {
  const { formatMessage } = useIntl();

  const { toast } = useToast();

  const { strategy } = useContext(StrategyContext);

  const [isDisabled, setIsDisabled] = useState(true);

  const COPY = useApi.CopyStrategy();
  const readOnly = COPY.isPending || COPY.isDone;
  const isLoading = COPY.isPending || COPY.isDone;
  const newStrategy = COPY.data;
  const error = COPY.error;

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      try {
        event.preventDefault();
        if (!COPY.canRun) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name))
          COPY.request({
            name,
            strategyId: strategy.id,
            strategyKind: strategy.kind,
          });
      } catch (error) {
        if (error instanceof ErrorInvalidArg) {
          toast.warning(
            formatMessage({ id: "errorMessage.invalidStrategyName" })
          );
        }
      }
    },
    [COPY, formatMessage, strategy, toast]
  );

  const onChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (isName(event.target.value)) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    },
    [setIsDisabled]
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

          <InputField
            required
            onChange={onChangeName}
            label={formatMessage({ id: "CopyStrategy.newStrategyName" })}
            name="name"
            placeholder={strategy.name}
            readOnly={readOnly}
          />

          <Field>
            <Control>
              <Button isLoading={isLoading} disabled={isDisabled}>
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