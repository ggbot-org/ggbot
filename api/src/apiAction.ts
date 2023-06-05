import {
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __500__INTERNAL_SERVER_ERROR__,
  ErrorHTTP,
  InternalServerError,
} from "@ggbot2/http";
import {
  AccountKey,
  ErrorAccountItemNotFound,
  ErrorUnimplementedStrategyKind,
  OperationInput,
  OperationOutput,
} from "@ggbot2/models";
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";
import { Dflow, DflowObject } from "dflow";

export type ApiActionInput<ApiActionType extends string> = {
  type: ApiActionType;
  data?: DflowObject | undefined;
};

export type ApiActionResponseError = {
  error: ApiActionServerSideError;
};

export const isApiActionResponseError = objectTypeGuard<ApiActionResponseError>(
  ({ error }) => isApiActionServerSideError(error)
);

export type ApiActionResponseData = {
  data: OperationOutput;
};

export type ApiActionResponseOutput =
  | ApiActionResponseData
  | ApiActionResponseError;

export type ApiAction<
  Input extends OperationInput,
  Output = OperationOutput
> = {
  in: Input;
  out: Output;
};

// AccountKey is provided by authentication, no need to add it as action input parameter.
export type AuthenticatedApiAction<Input extends OperationInput> = ApiAction<
  Input extends AccountKey ? Omit<Input, "accountId"> : Input
>;

// Server errors
// ////////////

const apiActionServerSideErrorNames = [
  ErrorHTTP.name,
  ErrorAccountItemNotFound.name,
  ErrorUnimplementedStrategyKind.name,
  InternalServerError.name,
] as const;
export type ApiActionServerSideErrorName =
  (typeof apiActionServerSideErrorNames)[number];
export const isApiActionServerSideErrorName =
  isLiteralType<ApiActionServerSideErrorName>(apiActionServerSideErrorNames);

export type ApiActionServerSideError = {
  name: ApiActionServerSideErrorName;
  info?: DflowObject;
};

export const isApiActionServerSideError =
  objectTypeGuard<ApiActionServerSideError>(
    ({ name, info }) =>
      isApiActionServerSideErrorName(name) &&
      (info === undefined ? true : Dflow.isObject(info))
  );

// Client errors
// ////////////

export const apiActionClientSideErrorNames = [
  "BadRequest",
  "GenericError",
  "NotFound",
  "Timeout",
  "Unauthorized",
] as const;
export type ApiActionClientSideErrorName =
  (typeof apiActionClientSideErrorNames)[number];
export const isApiActionClientSideErrorName =
  isLiteralType<ApiActionClientSideErrorName>(apiActionClientSideErrorNames);

export type ApiActionClientSideError = {
  name: ApiActionClientSideErrorName;
};

export const isApiActionClientSideError =
  objectTypeGuard<ApiActionClientSideError>(({ name }) =>
    isApiActionClientSideErrorName(name)
  );
