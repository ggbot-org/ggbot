import { Button, Fieldset } from "@ggbot2/ui-components";
import { FC, FormEventHandler, useCallback } from "react";
import { useApiAction } from "_hooks";
import type { StrategyKey } from "_routing";

type Props = {
  strategyKey: StrategyKey;
};

export const SchedulingsForm: FC<Props> = () => {
  const [update, { isPending }] = useApiAction.UPDATE_ACCOUNT_STRATEGIES_ITEM();

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      if (isPending) return;
      update();
    },
    [update, isPending]
  );

  return (
    <form onSubmit={onSubmit}>
      <Fieldset legend={<span className="text-lg">schedulings</span>}>
        <menu className="flex flex-row flex-wrap gap-4">
          <li>
            <Button color="primary">activate</Button>
          </li>
        </menu>
      </Fieldset>
    </form>
  );
};
