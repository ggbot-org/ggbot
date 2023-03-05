import { FormOnSubmit } from "@ggbot2/design";
import { FC, useCallback } from "react";
import { PromptConfirmation } from "_components";
import { OneSectionLayout } from "_layouts";
import { useApiAction } from "_hooks";

// TODO remove this page, use a Modal
export const DeleteAccountPage: FC = () => {
  const [deleteAccount, { isPending }] = useApiAction.DeleteAccount();

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteAccount({});
    },
    [isPending, deleteAccount]
  );

  return (
    <OneSectionLayout>
      <PromptConfirmation color="danger" header="Account deletion" onSubmit={onSubmit}>
        <p>Are you sure you want to delete your account?</p>
      </PromptConfirmation>
    </OneSectionLayout>
  );
};
