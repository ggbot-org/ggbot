import { Message } from "@ggbot2/design";
import { FC } from "react";

export const GenericErrorMessage: FC = () => {
  return <Message color="warning">Something went wrong.</Message>;
};

export const TimeoutErrorMessage: FC = () => {
  return <Message color="warning">Request not sent. Please check connectivity and try again.</Message>;
};
