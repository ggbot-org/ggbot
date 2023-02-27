import { Button, Control, Field, FormOnSubmit, InputField, useFormattedDate } from "@ggbot2/design";
import { ErrorInvalidArg, isName, throwIfInvalidName } from "@ggbot2/models";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Navigation, Page } from "_components";
import { useApiAction } from "_hooks";
import { StrategyInfo, requireAuthenticationAndGetStrategyInfo, route } from "_routing";

type ServerSideProps = StrategyInfo;

export const getServerSideProps = requireAuthenticationAndGetStrategyInfo;

const CopyStrategyPage: NextPage<ServerSideProps> = ({ strategyKey, name: strategyName, whenCreated }) => {
  const router = useRouter();

  const [isDisabled, setIsDisabled] = useState(true);

  const [copyStrategy, { data: whenCopied, isPending }] = useApiAction.CopyStrategy();

  const formattedWhenCreated = useFormattedDate(whenCreated, "date");

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      try {
        event.preventDefault();
        if (isPending) return;
        if (whenCopied) return;
        const name = (event.target as EventTarget & { name: { value: string } }).name.value;
        throwIfInvalidName(name);
        if (isName(name)) copyStrategy({ name, ...strategyKey });
      } catch (error) {
        if (error instanceof ErrorInvalidArg) toast.error("Invalid strategy name");
      }
    },
    [isPending, strategyKey, copyStrategy, whenCopied]
  );

  const onChangeName = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (isName(event.target.value)) setIsDisabled(false);
      else setIsDisabled(true);
    },
    [setIsDisabled]
  );

  useEffect(() => {
    if (!whenCopied) return;
    router.push(route.homePage());
  }, [router, whenCopied]);

  return (
    <Page topbar={<Navigation />}>
      <form className="flex flex-col w-full max-w-lg p-4 gap-4" onSubmit={onSubmit}>
        <h1>Copy strategy</h1>
        <InputField label="Name" defaultValue={strategyName} />
        <InputField label="When created" defaultValue={formattedWhenCreated} />

        <p>Choose a new name for the copied strategy.</p>

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
            {whenCopied ? (
              <Button color="primary">Done</Button>
            ) : (
              <Button isLoading={isPending} disabled={isDisabled}>
                Copy
              </Button>
            )}
          </Control>
        </Field>
      </form>
    </Page>
  );
};

export default CopyStrategyPage;
