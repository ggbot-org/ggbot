import { Dflow, DflowObject } from "dflow";
import {
  ErrorHTTP,
  InternalServerError,
  __400__BAD_REQUEST__,
  __401__UNAUTHORIZED__,
  __500__INTERNAL_SERVER_ERROR__,
} from "@ggbot2/http-status-codes";
// TODO move these errors in models, update this package deps
import {
  ErrorAccountItemNotFound,
  ErrorUnimplementedStrategyKind,
} from "@ggbot2/database";
import { objectTypeGuard } from "@ggbot2/type-utils";

// Server errors
// ////////////

const apiActionErrorNames = [
  ErrorHTTP.name,
  ErrorAccountItemNotFound.name,
  ErrorUnimplementedStrategyKind.name,
  InternalServerError.name,
] as const;
export type ApiActionErrorName = (typeof apiActionErrorNames)[number];

const isApiActionErrorName = (arg: unknown): arg is ApiActionErrorName => {
  if (typeof arg !== "string") return false;
  return (apiActionErrorNames as readonly string[]).includes(arg);
};

export type ApiActionError = {
  name: ApiActionErrorName;
  info?: DflowObject;
};

export const isApiActionError = objectTypeGuard<ApiActionError>(
  ({ name, info }) =>
    isApiActionErrorName(name) &&
    (info === undefined ? true : Dflow.isObject(info))
);

export type ApiActionResponseError = {
  error: ApiActionError;
};

export const isApiActionResponseError = objectTypeGuard<ApiActionResponseError>(
  ({ error }) => isApiActionError(error)
);

// Client errors
// ////////////

const errorNames = ["GenericError", "Timeout", "Unauthorized"] as const;
type ErrorName = (typeof errorNames)[number];

export type ActionError =
  | {
      name: ErrorName;
    }
  | ApiActionError;
