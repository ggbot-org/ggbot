import { Action } from "@ggbot2/api-action";
import { ReadAccount } from "@ggbot2/models";
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";

export type UserApiAction = {
  ReadAccount: Action<ReadAccount["in"]>;
};

export const userApiActionTypes = ["ReadAccount"] as const;
export type UserApiActionType = (typeof userApiActionTypes)[number];
export const isUserApiActionType =
  isLiteralType<UserApiActionType>(userApiActionTypes);

export type UserApiActionRequestData = {
  type: UserApiActionType;
};

export const isUserApiActionRequestData =
  objectTypeGuard<UserApiActionRequestData>(({ type }) =>
    isUserApiActionType(type)
  );
