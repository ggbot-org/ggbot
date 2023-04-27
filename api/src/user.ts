import { Action } from "@ggbot2/api-action";
import { ReadAccount } from "@ggbot2/models";
import { isLiteralType } from "@ggbot2/type-utils";

export type UserApiAction = {
  ReadAccount: Action<ReadAccount["in"]>;
};

export const userApiActionTypes = ["ReadAccount"] as const;
export type UserApiActionType = (typeof userApiActionTypes)[number];
export const isUserApiActionType =
  isLiteralType<UserApiActionType>(userApiActionTypes);
