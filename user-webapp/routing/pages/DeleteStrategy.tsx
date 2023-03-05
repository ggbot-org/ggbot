import { InputField, FormOnSubmit, Message, useFormattedDate } from "@ggbot2/design";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect } from "react";
import { PromptConfirmation } from "_components";
import { useApiAction } from "_hooks";
import { OneSectionLayout } from "_layouts";
import { StrategyInfo, route } from "_routing";

// TODO remove this page, use a Modal

type Props = Pick<StrategyInfo, "accountIsOwner" | "strategyKey" | "name" | "whenCreated">;

export const DeleteStrategyPage: FC<Props> = ({ accountIsOwner, strategyKey, name, whenCreated }) => {
  const router = useRouter();

  const [deleteStrategy, { isPending, data: whenDeleted }] = useApiAction.DeleteStrategy();

  const formattedWhenCreated = useFormattedDate(whenCreated, "time");

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteStrategy(strategyKey);
    },
    [isPending, deleteStrategy, strategyKey]
  );

  useEffect(() => {
    if (!whenDeleted) return;
    router.push(route.homePage());
  }, [router, whenDeleted]);

  return (
    <OneSectionLayout>
      {accountIsOwner ? (
        <PromptConfirmation header="Delete strategy" color="danger" onSubmit={onSubmit}>
          <p>Are you sure you want to delete this strategy?</p>

          <InputField readOnly label="Name" defaultValue={name} />

          <InputField readOnly label="When created" defaultValue={formattedWhenCreated} />
        </PromptConfirmation>
      ) : (
        <Message>Cannot delete strategy. Permission denied!</Message>
      )}
    </OneSectionLayout>
  );
};
