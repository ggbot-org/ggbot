import {
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __500__INTERNAL_SERVER_ERROR__,
  BadGatewayError,
  BadRequestError,
  ErrorHTTP,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@ggbot2/http";
import {
  ErrorAccountItemNotFound,
  ErrorExceededQuota,
  ErrorUnimplementedStrategyKind,
} from "@ggbot2/models";
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";
import { Dflow, DflowObject } from "dflow";

export type ApiActionInput<ApiActionType extends string> = {
  type: ApiActionType;
  data?: unknown;
};

export type ApiActionResponseError = {
  error: ApiActionServerSideError;
};

export const isApiActionResponseError = objectTypeGuard<ApiActionResponseError>(
  ({ error }) => isApiActionServerSideError(error)
);

export type ApiActionResponseData = {
  data: unknown;
};

export const isApiActionResponseData = objectTypeGuard<ApiActionResponseData>(
  ({ data }) => data !== undefined
);

export type ApiActionResponseOutput =
  | ApiActionResponseData
  | ApiActionResponseError;

// Server errors
// ////////////

const apiActionServerSideErrorNames = [
  // Model errors.
  ErrorAccountItemNotFound.errorName,
  ErrorExceededQuota.errorName,
  ErrorUnimplementedStrategyKind.errorName,
  // Other errors.
  BadGatewayError.errorName,
  ErrorHTTP.errorName, // TODO is this server side?
  InternalServerError.errorName,
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
  BadRequestError.errorName,
  UnauthorizedError.errorName,
  NotFoundError.errorName,
  "GenericError",
  "Timeout",
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
