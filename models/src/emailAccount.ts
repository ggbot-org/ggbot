import { AccountKey, isAccountKey } from "./account.js";
import { EmailAddress, isEmailAddress } from "./email.js";
import type { ItemKey } from "./item.js";
import { objectTypeGuard } from "./objects.js";
import type { Operation } from "./operation.js";
import { CreationTime, isCreationTime } from "./time.js";

export type EmailAccount = AccountKey &
  ItemKey<{ email: EmailAddress }> &
  CreationTime;

export const isEmailAccount = objectTypeGuard<EmailAccount>(
  ({ accountId, email, ...creationTime }) =>
    isAccountKey({ accountId }) &&
    isCreationTime(creationTime) &&
    isEmailAddress(email)
);

export type CreateEmailAccount = Operation<
  Omit<EmailAccount, "whenCreated">,
  CreationTime
>;

export type ReadEmailAccount = Operation<EmailAddress, EmailAccount | null>;
