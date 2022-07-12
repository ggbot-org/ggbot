import type { EmailAddress } from "./email.js";
import type { Item, NewItem } from "./item.js";
import type { DeletionTime } from "./time.js";
import type { Operation } from "./operation.js";

export type Account = Item & {
  email: EmailAddress;
};

export type AccountKey = Readonly<{
  accountId: Item["id"];
}>;

export type CreateAccount = Operation<NewItem<Account>, Account>;
export type ReadAccount = Operation<AccountKey, Account>;
export type DeleteAccount = Operation<AccountKey, DeletionTime>;
