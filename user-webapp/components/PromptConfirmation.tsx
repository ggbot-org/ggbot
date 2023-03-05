import { Button, Control, Field, FormProps, Message, MessageProps } from "@ggbot2/design";
import { FC, PropsWithChildren } from "react";
import { useGoBack } from "_hooks";

// TODO refactor this component, use modals

type Props = Pick<MessageProps, "color" | "header"> & Pick<FormProps, "onSubmit">;

export const PromptConfirmation: FC<PropsWithChildren<Props>> = ({ children, color, header, onSubmit }) => {
  const goBack = useGoBack();

  return (
    <Message color={color} header={header}>
      {children}

      <form onSubmit={onSubmit}>
        <Field isGrouped>
          <Control>
            <Button type="reset" onClick={goBack}>
              No, go back...
            </Button>
          </Control>

          <Control>
            <Button type="submit" color={color}>
              Yes, delete it!
            </Button>
          </Control>
        </Field>
      </form>
    </Message>
  );
};
