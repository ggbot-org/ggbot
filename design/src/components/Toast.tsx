import { FC, ReactNode, useCallback, useEffect, useRef } from "react";
import { ButtonDelete, ButtonDeleteProps, Message, MessageProps } from "trunx";

import { _classNames } from "../components/_classNames.js";

export type ToastProps = {
  close: () => void;
  color: Extract<MessageProps["color"], "info" | "danger" | "warning">;
  message: ReactNode;
  timeout?: number;
};

export const Toast: FC<ToastProps> = ({ close, color, message }) => {
  const timeout = 10000;
  const timeoutIdRef = useRef(0);

  // Close message after a while.
  useEffect(() => {
    timeoutIdRef.current = window.setTimeout(() => {
      close();
    }, timeout);
    return () => {
      window.clearTimeout(timeoutIdRef.current);
    };
  }, [close, timeoutIdRef]);

  // If user interacts with the message, it will stay around.
  const onClickMessage = useCallback(() => {
    window.clearTimeout(timeoutIdRef.current);
  }, [timeoutIdRef]);

  const onClickClose = useCallback<
    Exclude<ButtonDeleteProps["onClick"], undefined>
  >(
    (event) => {
      event.stopPropagation();
      close();
    },
    [close]
  );

  return (
    <Message
      color={color}
      onClick={onClickMessage}
      header={<ButtonDelete size="small" onClick={onClickClose} />}
    >
      <div>{message}</div>
    </Message>
  );
};
