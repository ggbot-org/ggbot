import {
  ReadStrategyFlow,
} from "@ggbot2/models";
import { isLiteralType, objectTypeGuard } from "@ggbot2/type-utils";
import { ApiActionInput, ApiAction as Action } from "./apiAction";

export const publicApiActionTypes = [
  "ReadStrategyFlow",
] as const;
export type PublicApiActionType = (typeof publicApiActionTypes)[number];
export const isPublicApiActionType =
  isLiteralType<PublicApiActionType>(publicApiActionTypes);

export type PublicApiAction = {
  ReadStrategyFlow: Action<ReadStrategyFlow["in"]>;
};

export type PublicApiActionRequestData = ApiActionInput<PublicApiActionType>

export const isPublicApiActionRequestData =
  objectTypeGuard<PublicApiActionRequestData>(({ type }) =>
    isPublicApiActionType(type)
  );
