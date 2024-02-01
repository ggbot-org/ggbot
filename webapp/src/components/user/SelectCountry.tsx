import { SelectField, SelectFieldProps } from "_/components/library"
import { useUserApi } from "_/hooks/useUserApi"
import {
	AllowedCountryIsoCode2,
	allowedCountryIsoCodes2,
	isAllowedCountryIsoCode2
} from "@workspace/models"
import {
	ChangeEventHandler,
	FC,
	SelectHTMLAttributes,
	useCallback,
	useEffect,
	useState
} from "react"
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

	const WRITE = useUserApi.SetAccountCountry()
	const READ = useUserApi.ReadAccountInfo()
	const account = READ.data

	const [country, setCountry] = useState<AllowedCountryIsoCode2 | "">("")

	const allowedCountryOptions: SelectFieldProps["options"] =
		allowedCountryIsoCodes2.map((countryIsocode) => ({
			value: countryIsocode,
			label: countryName[countryIsocode]
		}))

	let countryOptions: SelectFieldProps["options"] = []
	if (account) {
		// It is not allowed to unset the country.
		countryOptions = country
			? allowedCountryOptions
			: [
					{
						value: "",
						label: formatMessage({ id: "SelectCountry.noValue" })
					},
					...allowedCountryOptions
			  ]
	}

	const onChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
		(event) => {
			const { value } =
				event.target as unknown as SelectHTMLAttributes<HTMLSelectElement>
			if (!WRITE.canRun) return
			if (isAllowedCountryIsoCode2(value)) {
				WRITE.request({ country: value })
				setCountry(value)
			}
		},
		[WRITE]
	)

	useEffect(() => {
		if (!account) return
		if (account.country) setCountry(account.country)
	}, [account, setCountry])

	useEffect(() => {
		if (READ.canRun) READ.request()
	}, [READ])

	useEffect(() => {
		if (WRITE.isDone) WRITE.reset()
	}, [WRITE])

	return (
		<SelectField
			disabled={account === undefined}
			label={formatMessage({ id: "SelectCountry.label" })}
			options={countryOptions}
			onChange={onChange}
			value={country}
			name={name}
		/>
	)
}
