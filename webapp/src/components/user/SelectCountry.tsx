import { SelectField, SelectFieldProps } from "_/components/library"
import { isAllowedCountryIsoCode2 } from "@ggbot2/models"
import { countries } from "country-isocode2/en"
import { FC } from "react"
import { useIntl } from "react-intl"

// TODO i18n for country names, and label "-- your country --"
// do not import country names from "country-isocode2/en",
// create a map with allowed countries.
const allowedCountryOptions = Object.entries(countries)
	.filter(([isoCode2]) => isAllowedCountryIsoCode2(isoCode2))
	.map(([isoCode2, country]) => ({
		value: isoCode2,
		label: country
	}))

type Props = Omit<SelectFieldProps, "label" | "options">

const countryOptions: SelectFieldProps["options"] = allowedCountryOptions

export const SelectCountry: FC<Props> = (props) => {
	const { formatMessage } = useIntl()

	return (
		<SelectField
			label={formatMessage({ id: "SelectCountry.label" })}
			options={countryOptions}
			{...props}
		/>
	)
}
