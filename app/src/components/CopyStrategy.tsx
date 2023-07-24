import {
  Button,
  Control,
  Field,
  Form,
  FormOnSubmit,
  InputField,
  Message,
  Title,
  useFormattedDate,
} from "@ggbot2/design";
import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import {
  ChangeEventHandler,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FormattedMessage } from "react-intl";

import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { buttonLabel, errorMessage, fieldLabel, title } from "../i18n/index.js";
import { href } from "../routing/hrefs.js";

export const CopyStrategy: FC = () => {
  const { strategyWhenCreated, strategyName, strategyKey } =
    useContext(StrategyContext);

  const [isDisabled, setIsDisabled] = useState(true);

  const COPY = useApi.CopyStrategy();
  const redirectToHomepage = COPY.isDone;
  const readOnly = COPY.isPending || COPY.isDone;
  const isLoading = COPY.isPending || COPY.isDone;

  const formattedWhenCreated = useFormattedDate(strategyWhenCreated, "day");

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      try {
        event.preventDefault();
        if (!COPY.canRun) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name) && strategyKey) COPY.request({ name, ...strategyKey });
      } catch (error) {
        if (error instanceof ErrorInvalidArg) {
          // TODO show error to user
          console.error(errorMessage.invalidStrategyName);
        }
      }
    },
    [COPY, strategyKey]
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
    if (redirectToHomepage) window.location.href = href.homePage();
  }, [redirectToHomepage]);

  return (
    <Form box onSubmit={onSubmit}>
      <Title>{title.copyStrategy}</Title>

      <InputField label={fieldLabel.strategyName} defaultValue={strategyName} />

      <InputField
        label={fieldLabel.whenCreated}
        defaultValue={formattedWhenCreated}
      />

      <Message>
        <FormattedMessage id="CopyStrategy.chooseNewName" />
      </Message>

      <InputField
        required
        onChange={onChangeName}
        label={fieldLabel.newStrategyName}
        name="name"
        placeholder={strategyName}
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
