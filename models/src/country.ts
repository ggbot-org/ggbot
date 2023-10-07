import { isLiteralType } from "minimal-type-guard-helpers"

export const allowedCountryIsoCodes2 = [
	"AT",
	"FR",
	"IT",
	"DE",
	"ES",
	"GR",
	"NL",
	"PT"
] as const
export type AllowedCountryIsoCode2 = (typeof allowedCountryIsoCodes2)[number]
export const isAllowedCountryIsoCode2 = isLiteralType<AllowedCountryIsoCode2>(
	allowedCountryIsoCodes2
)
