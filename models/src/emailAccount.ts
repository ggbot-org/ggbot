import { AccountKey, isAccountKey } from "./account.js";
import { EmailAddress, isEmailAddress } from "./email.js";
import type { ItemKey } from "./item.js";
import type { Operation } from "./operation.js";
import { CreationTime, isCreationTime } from "./time.js";

export type EmailAccount = AccountKey &
  ItemKey<{ email: EmailAddress }> &
  CreationTime;

export const isEmailAccount = (arg: unknown): arg is EmailAccount => {
  if (typeof arg !== "object" || arg === null) return false;
  const { accountId, email, ...creationTime } = arg as Partial<EmailAccount>;
  return (
    isAccountKey({ accountId }) &&
    isCreationTime(creationTime) &&
    isEmailAddress(email)
  );
};

export type CreateEmailAccount = Operation<
  Omit<EmailAccount, "whenCreated">,
  CreationTime
>;

export type ReadEmailAccount = Operation<EmailAddress, EmailAccount | null>;
