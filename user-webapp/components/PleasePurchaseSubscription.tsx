import { Control, Field, Message } from "@ggbot2/design";
import { FC } from "react";
import { ButtonGoSettings } from "_components";

export const PleasePurchaseSubscription: FC = () => {
  return (
    <>
      <Message color="warning">
        <p>You cannot run a strategy without a subscription.</p>

        <p>
          Please go to <em>Settings</em> and <b>purchase</b> a subscription.
        </p>
      </Message>

      <Field>
        <Control>
          <ButtonGoSettings section="billing" />
        </Control>
      </Field>
    </>
  );
};
