import { ListAccountKeys, ReadAccount } from "@ggbot2/models";
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";

import {
  ApiActionInput,
  AuthenticatedApiAction as Action,
} from "./apiAction.js";

export const adminApiActionTypes = ["ListAccountKeys", "ReadAccount"] as const;
export type AdminApiActionType = (typeof adminApiActionTypes)[number];
export const isAdminApiActionType =
  isLiteralType<AdminApiActionType>(adminApiActionTypes);

export type AdminApiAction = {
  ReadAccount: Action<ReadAccount["in"]>;
  ListAccountKeys: Action<ListAccountKeys["in"]>;
};

export type AdminApiActionRequestData = ApiActionInput<AdminApiActionType>;

export const isAdminApiActionRequestData =
  objectTypeGuard<AdminApiActionRequestData>(({ type }) =>
    isAdminApiActionType(type)
  );
