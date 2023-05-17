import { objectTypeGuard } from "@ggbot2/type-utils";

import {
  AllowedCountryIsoCode2,
  isAllowedCountryIsoCode2,
} from "./countries.js";
import { EmailAddress, isEmailAddress } from "./email.js";
import { isItemId, Item, ItemKey, newId, NewItem } from "./item.js";
import { isName, Name, normalizeName } from "./name.js";
import { Operation } from "./operation.js";
import {
  createdNow,
  CreationTime,
  DeletionTime,
  isCreationTime,
  UpdateTime,
} from "./time.js";

export type Account = Item &
  CreationTime & {
    country?: AllowedCountryIsoCode2;
    name?: undefined | Name;
    email: EmailAddress;
  };

export const isAccount = objectTypeGuard<Account>(
  ({ id, country, email, name, ...creationTime }) =>
    isItemId(id) &&
    isEmailAddress(email) &&
    isCreationTime(creationTime) &&
    (country === undefined ? true : isAllowedCountryIsoCode2(country)) &&
    (name === undefined ? true : isName(name))
);

export const newAccount = ({ email, name }: NewItem<Account>): Account => {
  const optionalName =
    typeof name === "string" ? normalizeName(name) : undefined;
  return {
    ...createdNow(),
    id: newId(),
    email,
    name: optionalName,
  };
};

export type AccountKey = ItemKey<{
  accountId: Account["id"];
}>;

export const isAccountKey = objectTypeGuard<AccountKey>(({ accountId }) =>
  isItemId(accountId)
);

export type CreateAccount = Operation<NewItem<Account>, Account>;

export type ReadAccount = Operation<AccountKey, Account | null>;

export const isReadAccountInput = objectTypeGuard<AccountKey>((accountKey) =>
  isAccountKey(accountKey)
);

export type RenameAccount = Operation<AccountKey & { name: Name }, UpdateTime>;

export const isRenameAccountInput = objectTypeGuard<RenameAccount["in"]>(
  ({ name, ...accountKey }) => isName(name) && isAccountKey(accountKey)
);

export type SetAccountCountry = Operation<
  AccountKey & { country: AllowedCountryIsoCode2 },
  UpdateTime
>;

export const isSetAccountCountryInput = objectTypeGuard<
  SetAccountCountry["in"]
>(
  ({ country, ...accountKey }) =>
    isAllowedCountryIsoCode2(country) && isAccountKey(accountKey)
);

export type DeleteAccount = Operation<AccountKey, DeletionTime>;

export type ListAccountKeys = Operation<void, AccountKey[]>;
