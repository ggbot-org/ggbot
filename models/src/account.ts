import { arrayTypeGuard, objectTypeGuard } from "@ggbot2/type-utils";

import { AllowedCountryIsoCode2, isAllowedCountryIsoCode2 } from "./country.js";
import { EmailAddress, isEmailAddress, noneEmail } from "./email.js";
import { isItemId, Item, ItemKey, newId, NewItem, nullId } from "./item.js";
import { isName, Name, normalizeName } from "./name.js";
import {
  DeleteOperation,
  Operation,
  ReadOperation,
  UpdateOperation,
} from "./operation.js";
import { createdNow, CreationTime, isCreationTime } from "./time.js";

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

export const noneAccount: Account = {
  id: nullId,
  whenCreated: 0,
  email: noneEmail,
};

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

export type AccountKeys = AccountKey[];

export const isAccountKeys = arrayTypeGuard<AccountKey>(isAccountKey);

export type CreateAccount = Operation<NewItem<Account>, Account>;

export type ReadAccount = ReadOperation<AccountKey, Account>;

export const isReadAccountInput = objectTypeGuard<AccountKey>((accountKey) =>
  isAccountKey(accountKey)
);

export type RenameAccount = UpdateOperation<AccountKey & { name: Name }>;

export const isRenameAccountInput = objectTypeGuard<RenameAccount["in"]>(
  ({ name, ...accountKey }) => isName(name) && isAccountKey(accountKey)
);

export type SetAccountCountry = UpdateOperation<
  AccountKey & { country: AllowedCountryIsoCode2 }
>;

export const isSetAccountCountryInput = objectTypeGuard<
  SetAccountCountry["in"]
>(
  ({ country, ...accountKey }) =>
    isAllowedCountryIsoCode2(country) && isAccountKey(accountKey)
);

export type DeleteAccount = DeleteOperation<AccountKey>;

export type ListAccountKeys = ReadOperation<void, AccountKeys>;
