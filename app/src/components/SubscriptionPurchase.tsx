import {
	Box,
	Button,
	Checkmark,
	Column,
	Columns,
	Control,
	Field,
	Flex,
	InputOnChange,
	Message,
	SelectOnChange,
	SelectProps,
	Title
} from "@ggbot2/design"
import {
	AllowedCountryIsoCode2,
	isAllowedCountryIsoCode2,
	monthlyPrice,
	purchaseCurrency,
	purchaseDefaultNumMonths as defaultNumMonths,
	purchaseMaxNumMonths as maxNumMonths,
	purchaseMinNumMonths as minNumMonths
} from "@ggbot2/models"
import { isMaybeObject, isNaturalNumber } from "@ggbot2/type-utils"
import { countries } from "country-isocode2/en"
import { getTime, now } from "minimal-time-helpers"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { AuthenticationContext } from "../authentication/contexts/Authentication.js"
import { Email } from "../components/Email.js"
import {
	SubscriptionEnd,
	SubscriptionEndProps
} from "../components/SubscriptionEnd.js"
import { SubscriptionNumMonths } from "../components/SubscriptionNumMonths.js"
import { SubscriptionTotalPrice } from "../components/SubscriptionTotalPrice.js"
import { SubscriptionContext } from "../contexts/Subscription.js"
import { useUserApi } from "../hooks/useUserApi.js"
import { url } from "../routing/URLs.js"
import { SelectCountry } from "./SelectCountry.js"

const fieldName = {
	country: "country"
}
// TODO  use Form
// const fields = Object.keys(fieldName)

// TODO i18n for country names, and label "-- your country --"
// do not import country names from "country-isocode2/en",
// create a map with allowed countries.
const allowedCountryOptions = Object.entries(countries)
	.filter(([isoCode2]) => isAllowedCountryIsoCode2(isoCode2))
	.map(([isoCode2, country]) => ({
		value: isoCode2,
		label: country
	}))

export const SubscriptionPurchase: FC = () => {
	const { formatNumber } = useIntl()

	const { account } = useContext(AuthenticationContext)
	const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd } =
		useContext(SubscriptionContext)

	const SET_COUNTRY = useUserApi.SetAccountCountry()

	const [purchaseIsPending, setPurchaseIsPending] = useState(false)
	const [country, setCountry] = useState<AllowedCountryIsoCode2 | "">("")
	const [numMonths, setNumMonths] = useState<number | undefined>(
		defaultNumMonths
	)

	{
		/* TODO move it to SelectCountry component */
	}
	const countryOptions: SelectProps["options"] = allowedCountryOptions

	let purchaseIsDisabled = false
	if (!country) purchaseIsDisabled = true
	if (isNaturalNumber(numMonths)) {
		if (numMonths < minNumMonths) purchaseIsDisabled = true
		if (numMonths > maxNumMonths) purchaseIsDisabled = true
	}

	let newSubscriptionEnd: SubscriptionEndProps["value"]
	if (isNaturalNumber(numMonths)) {
		const start = subscriptionEnd
			? getTime(subscriptionEnd).plusOne.day
			: now()
		newSubscriptionEnd = getTime(start).plus(
			numMonths >= maxNumMonths - 1 ? maxNumMonths : numMonths
		).months
	}

	const isYearlyPurchase: boolean | undefined =
		typeof numMonths === "number" && numMonths >= maxNumMonths - 1
			? true
			: undefined

	const onChangeNumMonths = useCallback<InputOnChange>(
		(event) => {
			const value = event.target.value
			if (value === "") {
				setNumMonths(undefined)
				return
			}
			const num = Number(value)
			if (num >= minNumMonths && num <= maxNumMonths) setNumMonths(num)
		},
		[setNumMonths]
	)

	const onChangeCountry = useCallback<SelectOnChange>(
		(event) => {
			const country = event.target.value
			if (isAllowedCountryIsoCode2(country)) setCountry(country)
		},
		[setCountry]
	)

	const onClickPurchase = useCallback(async () => {
		if (purchaseIsDisabled) return
		if (purchaseIsPending) return
		setPurchaseIsPending(true)
		try {
			const response = await fetch(url.apiPurchaseOrder, {
				// TODO define fields (and type-guard) in api package, use them also in utrust lambda
				body: JSON.stringify({
					accountId: account.id,
					country,
					email: account.email,
					numMonths
				}),
				credentials: "omit",
				headers: new Headers({
					Accept: "application/json",
					"Content-Type": "application/json"
				}),
				method: "POST"
			})
			if (response.ok) {
				const data = await response.json()
				if (isMaybeObject<{ redirectUrl: string }>(data)) {
					const { redirectUrl } = data
					if (typeof redirectUrl === "string")
						window.location.href = redirectUrl
				}
			}
		} catch (error) {
			console.error(error)
			setPurchaseIsPending(false)
		}
	}, [account, country, numMonths, purchaseIsDisabled, purchaseIsPending])

	useEffect(() => {
		if (account.country) setCountry(account.country)
	}, [account, setCountry])

	useEffect(() => {
		if (!country) return
		if (account.country === country) return

		if (SET_COUNTRY.canRun) SET_COUNTRY.request({ country })
	}, [SET_COUNTRY, account, country])

	const formattedMonthlyPrice = formatNumber(monthlyPrice, {
		style: "currency",
		currency: purchaseCurrency
	})

	if (!canPurchaseSubscription) return null

	return (
		<Box>
			<Title>
				<FormattedMessage id="SubscriptionPurchase.title" />
			</Title>

			{hasActiveSubscription ? (
				<Message color="danger">
					<FormattedMessage id="SubscriptionPurchase.couldRenew" />
				</Message>
			) : null}

			<Message>
				<p>
					<FormattedMessage
						id="SubscriptionPurchase.oneMonthPrice"
						values={{ price: formattedMonthlyPrice }}
					/>
				</p>

				<Flex>
					<span>
						<FormattedMessage
							id="SubscriptionPurchase.hint"
							values={{
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</span>

					<Checkmark ok={isYearlyPurchase || undefined} />
				</Flex>
			</Message>

			<Email isStatic value={account.email} />

			<SelectCountry
				name={fieldName.country}
				onChange={onChangeCountry}
				options={countryOptions}
				value={country}
			/>

			<Columns>
				<Column isNarrow>
					<SubscriptionNumMonths
						value={numMonths}
						onChange={onChangeNumMonths}
					/>
				</Column>

				<Column>
					<SubscriptionEnd isStatic value={newSubscriptionEnd} />
				</Column>
			</Columns>

			<SubscriptionTotalPrice
				isYearlyPurchase={isYearlyPurchase}
				numMonths={numMonths}
			/>

			<Field>
				<Control>
					<Button
						color="primary"
						disabled={purchaseIsDisabled}
						onClick={onClickPurchase}
						isLoading={purchaseIsPending}
					>
						<FormattedMessage id="SubscriptionPurchase.button" />
					</Button>
				</Control>
			</Field>
		</Box>
	)
}
