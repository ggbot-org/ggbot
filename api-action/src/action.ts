import { AccountKey, OperationInput, OperationOutput } from "@ggbot2/models";
import { ApiActionResponseError } from "./errors";

export type Action<Input extends OperationInput> = {
  // AccountKey is provided by authentication, no need to add it as action input parameter.
  in: Input extends AccountKey ? Omit<Input, "accountId"> : Input;
  out: OperationOutput;
};

export type ApiActionInput<ApiActionType extends string> = {
  type: ApiActionType;
  data?: OperationInput;
};

export type ApiActionResponseOutput =
  | {
      data?: OperationOutput;
    }
  | ApiActionResponseError;
