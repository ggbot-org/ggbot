import {
  AccountKey,
  CreationDay,
  isAccountKey,
  isCreationDay,
} from "@ggbot2/models";
import { objectTypeGuard } from "@ggbot2/type-utils";

export type Session = AccountKey & CreationDay;

export const isSession = objectTypeGuard<Session>(
  ({ accountId, creationDay }) =>
    isAccountKey({ accountId }) && isCreationDay({ creationDay })
);

export const sessionNumDays = 30;
