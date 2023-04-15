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
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { useApiAction } from "_hooks";
import { buttonLabel, errorMessage, fieldLabel } from "_i18n";
import { OneSectionLayout } from "_layouts/OneSection";
import { StrategyInfo, pathname } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "name" | "whenCreated">;

export const CopyStrategyPage: FC<Props> = ({
  strategyKey,
  name: strategyName,
  whenCreated,
}) => {
  const router = useRouter();

  const [isDisabled, setIsDisabled] = useState(true);

  const [copyStrategy, { data: isDone, isPending }] =
    useApiAction.CopyStrategy();

  const formattedWhenCreated = useFormattedDate(whenCreated, "day");

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      try {
        event.preventDefault();
        if (isPending || isDone) return;
        const name = (event.target as EventTarget & { name: { value: string } })
          .name.value;
        throwIfInvalidName(name);
        if (isName(name)) copyStrategy({ name, ...strategyKey });
      } catch (error) {
        if (error instanceof ErrorInvalidArg)
          toast.error(errorMessage.invalidStrategyName);
      }
    },
    [isPending, strategyKey, copyStrategy, isDone]
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
    router.push(pathname.homePage());
  }, [router, isDone]);

  return (
    <OneSectionLayout>
      <Form box onSubmit={onSubmit}>
        <Title>Copy strategy</Title>

        <InputField
          label={fieldLabel.strategyName}
          defaultValue={strategyName}
        />

        <InputField
          label={fieldLabel.whenCreated}
          defaultValue={formattedWhenCreated}
        />

        <Message>Choose a new name for the copied strategy.</Message>

        <InputField
          onChange={onChangeName}
          label={fieldLabel.newStrategyName}
          name="name"
          placeholder={strategyName}
          required
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
    </OneSectionLayout>
  );
};
