import { AccountKey, isAccountKey } from "./account.js";
import { EmailAddress, isEmailAddress } from "./email.js";
import { Operation } from "./operation.js";
import { CreationTime, isCreationTime } from "./time.js";

export type EmailAccount = AccountKey &
  CreationTime & { readonly email: EmailAddress };

export const isEmailAccount = (value: unknown): value is EmailAccount => {
  if (typeof value !== "object" || value === null) return false;
  const { accountId, email, whenCreated } = value as Partial<EmailAccount>;
  return (
    isAccountKey({ accountId }) &&
    isCreationTime({ whenCreated }) &&
    isEmailAddress(email)
  );
};

export type CreateEmailAccount = Operation<
  Omit<EmailAccount, "whenCreated">,
  CreationTime
>;

export type ReadEmailAccount = Operation<EmailAddress, EmailAccount | null>;
