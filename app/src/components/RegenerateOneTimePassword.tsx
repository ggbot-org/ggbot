import { Button, ButtonProps, Control, Field, Message } from "@ggbot2/design";
import { FC } from "react";
import { FormattedMessage } from "react-intl";

type Props = Pick<ButtonProps, "onClick">;

export const RegenerateOneTimePassword: FC<Props> = ({ onClick }) => (
  <>
    <Message>
      <FormattedMessage id="RegenerateOneTimePassword.message" />
    </Message>

    <Field>
      <Control>
        <Button onClick={onClick}>
          <FormattedMessage id="RegenerateOneTimePassword.button" />
        </Button>
      </Control>
    </Field>
  </>
);
