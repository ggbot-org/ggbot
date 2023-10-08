import {
	SelectField,
	SelectFieldProps,
	SelectOnChange
} from "_/components/library"
import { AuthenticationContext } from "_/contexts/Authentication"
import { useUserApi } from "_/hooks/useUserApi"
import {
	AllowedCountryIsoCode2,
	allowedCountryIsoCodes2,
	isAllowedCountryIsoCode2
} from "@workspace/models"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { useIntl } from "react-intl"

type Props = Pick<SelectFieldProps, "name">

export const SelectCountry: FC<Props> = ({ name }) => {
	const { formatMessage } = useIntl()

	const countryName: Record<AllowedCountryIsoCode2, string> = {
		AT: formatMessage({ id: "SelectCountry.AT" }),
		FR: formatMessage({ id: "SelectCountry.FR" }),
		IT: formatMessage({ id: "SelectCountry.IT" }),
		DE: formatMessage({ id: "SelectCountry.DE" }),
		ES: formatMessage({ id: "SelectCountry.ES" }),
		GR: formatMessage({ id: "SelectCountry.GR" }),
		NL: formatMessage({ id: "SelectCountry.NL" }),
		PT: formatMessage({ id: "SelectCountry.PT" })
	}

	const { account } = useContext(AuthenticationContext)

	const [country, setCountry] = useState<AllowedCountryIsoCode2 | "">("")

	const allowedCountryOptions: SelectFieldProps["options"] =
		allowedCountryIsoCodes2.map((countryIsocode) => ({
			value: countryIsocode,
			label: countryName[countryIsocode]
		}))

	// It is not allowed to unset the country.
	const countryOptions: SelectFieldProps["options"] = country
		? allowedCountryOptions
		: [
				{
					value: "",
					label: formatMessage({ id: "SelectCountry.noValue" })
				},
				...allowedCountryOptions
		  ]

	const SET_COUNTRY = useUserApi.SetAccountCountry()

	const onChange = useCallback<SelectOnChange>(
		(event) => {
			const value = event.target.value
			if (!SET_COUNTRY.canRun) return
			if (isAllowedCountryIsoCode2(value)) {
				SET_COUNTRY.request({ country: value })
				setCountry(value)
			}
		},
		[SET_COUNTRY]
	)

	useEffect(() => {
		if (!account) return
		if (account.country) setCountry(account.country)
	}, [account, setCountry])

	useEffect(() => {
		if (SET_COUNTRY.isDone) SET_COUNTRY.reset()
	}, [SET_COUNTRY])

	return (
		<SelectField
			label={formatMessage({ id: "SelectCountry.label" })}
			options={countryOptions}
			onChange={onChange}
			value={country}
			name={name}
		/>
	)
}
