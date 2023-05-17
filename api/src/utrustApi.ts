import {
  NaturalNumber,
  isNaturalNumber,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import {
  AccountKey,
  AllowedCountryIsoCode2,
  EmailAddress,
  isAccountKey,
  isAllowedCountryIsoCode2,
  isEmailAddress,
} from "@ggbot2/models";

export type ApiUtrustOrderRequestData = AccountKey & {
  country: AllowedCountryIsoCode2;
  email: EmailAddress;
  numMonths: NaturalNumber;
};

export const isApiUtrustOrderRequestData =
  objectTypeGuard<ApiUtrustOrderRequestData>(
    ({ country, email, numMonths, ...accountKey }) =>
      isAllowedCountryIsoCode2(country) &&
      isEmailAddress(email) &&
      isNaturalNumber(numMonths) &&
      isAccountKey(accountKey)
  );
