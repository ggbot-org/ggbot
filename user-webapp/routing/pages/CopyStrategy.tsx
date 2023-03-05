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
import { ChangeEventHandler, FC, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Navigation, Page } from "_components";
import { useApiAction } from "_hooks";
import { StrategyInfo, route } from "_routing";

type Props = Pick<StrategyInfo, "strategyKey" | "name" | "whenCreated">;

export const CopyStrategyPage: FC<Props> = ({ strategyKey, name: strategyName, whenCreated }) => {
  const router = useRouter();

  const [isDisabled, setIsDisabled] = useState(true);

  const [copyStrategy, { data: isDone, isPending }] = useApiAction.CopyStrategy();

  const formattedWhenCreated = useFormattedDate(whenCreated, "date");

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      try {
        event.preventDefault();
        if (isPending || isDone) return;
        const name = (event.target as EventTarget & { name: { value: string } }).name.value;
        throwIfInvalidName(name);
        if (isName(name)) copyStrategy({ name, ...strategyKey });
      } catch (error) {
        if (error instanceof ErrorInvalidArg) toast.error("Invalid strategy name");
      }
    },
    [isPending, strategyKey, copyStrategy, isDone]
  );

  const onChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (isName(event.target.value)) setIsDisabled(false);
      else setIsDisabled(true);
    },
    [setIsDisabled]
  );

  useEffect(() => {
    if (!isDone) return;
    router.push(route.homePage());
  }, [router, isDone]);

  return (
    <Page topbar={<Navigation />}>
      <Form onSubmit={onSubmit}>
        <Title>Copy strategy</Title>

        <InputField label="Name" defaultValue={strategyName} />

        <InputField label="When created" defaultValue={formattedWhenCreated} />

        <Message>Choose a new name for the copied strategy.</Message>

        <InputField
          onChange={onChangeName}
          label="New strategy name"
          name="name"
          placeholder={strategyName}
          required
          readOnly={isPending}
        />

        <Field>
          <Control>
            {isDone ? (
              <Button color="primary">Done</Button>
            ) : (
              <Button isLoading={isPending} disabled={isDisabled}>
                Copy
              </Button>
            )}
          </Control>
        </Field>
      </Form>
    </Page>
  );
};
