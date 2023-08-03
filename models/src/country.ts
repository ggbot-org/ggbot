import { isLiteralType } from "@ggbot2/type-utils";

export const allowedCountryIsoCodes2 = [
  "AT",
  "FR",
  "IT",
  "DE",
  "ES",
  "GB",
  "GR",
  "NL",
  "PT",
] as const;
export type AllowedCountryIsoCode2 = (typeof allowedCountryIsoCodes2)[number];
export const isAllowedCountryIsoCode2 = isLiteralType<AllowedCountryIsoCode2>(
  allowedCountryIsoCodes2
);
