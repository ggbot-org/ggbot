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
import { toast } from "react-hot-toast";

import { StrategyContext } from "../contexts/Strategy.js";
import { useApi } from "../hooks/useApi.js";
import { buttonLabel, errorMessage, fieldLabel, title } from "../i18n/index.js";
import { pathname } from "../routing/pathnames.js";

export const CopyStrategyForm: FC = () => {
  const { strategyWhenCreated, strategyName, strategyKey } =
    useContext(StrategyContext);

  const [isDisabled, setIsDisabled] = useState(true);

  const [COPY, { data: isDone, isPending }] = useApi.CopyStrategy();

  const formattedWhenCreated = useFormattedDate(strategyWhenCreated, "day");

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      try {
        event.preventDefault();
        if (isPending || isDone) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name) && strategyKey) COPY({ name, ...strategyKey });
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          toast.error(errorMessage.invalidStrategyName);
      }
    },
    [isPending, strategyKey, COPY, isDone]
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
    if (!isDone) return;
    window.location.pathname = pathname.homePage();
  }, [isDone]);

  return (
    <Form box onSubmit={onSubmit}>
      <Title>{title.copyStrategy}</Title>
      <InputField label={fieldLabel.strategyName} defaultValue={strategyName} />

      <InputField
        label={fieldLabel.whenCreated}
        defaultValue={formattedWhenCreated}
      />

      <Message>Choose a new name for the copied strategy.</Message>

      <InputField
        required
        onChange={onChangeName}
        label={fieldLabel.newStrategyName}
        name="name"
        placeholder={strategyName}
        readOnly={isPending ?? isDone}
      />

      <Field>
        <Control>
          <Button isLoading={isPending ?? isDone} disabled={isDisabled}>
            {buttonLabel.copy}
          </Button>
        </Control>
      </Field>
    </Form>
  );
};