import { FormOnSubmit } from "@ggbot2/design";
import { FC, useCallback } from "react";
import { PromptConfirmation } from "_components";
import { useApiAction } from "_hooks";
import { OneSectionLayout } from "_layouts";

// TODO remove this page, use a Modal

export const DeleteBinanceApiConfigPage: FC = () => {
  const [deleteBinanceApiKey, { isPending }] = useApiAction.DeleteBinanceApiConfig();

  const onSubmit = useCallback<FormOnSubmit>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      deleteBinanceApiKey({});
    },
    [isPending, deleteBinanceApiKey]
  );

  return (
    <OneSectionLayout>
      <PromptConfirmation color="danger" header="Delete Binance API" onSubmit={onSubmit}>
        <p>Are you sure you want to delete your Binance API configuration?</p>
      </PromptConfirmation>
    </OneSectionLayout>
  );
};
