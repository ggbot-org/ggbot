import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  InputField,
  Message,
  Title,
  useToast,
} from "@ggbot2/design";
import {
  ErrorExceededQuota,
  ErrorInvalidArg,
  isName,
  isStrategy,
  throwIfInvalidName,
} from "@ggbot2/models";
import {
  ChangeEventHandler,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { StrategyName } from "../components/StrategyName.js";
import { WhenCreated } from "../components/WhenCreated.js";
import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { buttonLabel, fieldLabel, title } from "../i18n/index.js";
import { href } from "../routing/hrefs.js";

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

  useEffect(() => {
    if (!error) return;
    if (error.name === ErrorExceededQuota.name) {
      toast.warning(
        formatMessage({ id: "errorMessage.maxStrategiesPerAccount" })
      );
    } else {
      toast.warning(formatMessage({ id: "errorMessage.generic" }));
    }
  }, [error, formatMessage, toast]);

  useEffect(() => {
    if (isStrategy(newStrategy)) {
      window.location.href = href.strategyPage({
        strategyId: newStrategy.id,
        strategyKind: newStrategy.kind,
      });
    }
  }, [newStrategy]);

  return (
    <Form box onSubmit={onSubmit}>
      <Title>{title.copyStrategy}</Title>

      <StrategyName readOnly value={strategy.name} />

      <WhenCreated value={strategy.whenCreated} />

      <Message>
        <FormattedMessage id="CopyStrategy.chooseNewName" />
      </Message>

      <InputField
        required
        onChange={onChangeName}
        label={fieldLabel.newStrategyName}
        name="name"
        placeholder={strategy.name}
        readOnly={readOnly}
      />

      <Field>
        <Control>
          <Button isLoading={isLoading} disabled={isDisabled}>
            {buttonLabel.copy}
          </Button>
        </Control>
      </Field>
    </Form>
  );
};
