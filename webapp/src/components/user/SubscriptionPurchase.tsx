import { Email } from "_/components/Email.js"
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
	Title
} from "_/components/library"
import {
	SubscriptionEnd,
	SubscriptionEndProps
} from "_/components/SubscriptionEnd.js"
import { SubscriptionNumMonths } from "_/components/SubscriptionNumMonths.js"
import { SelectCountry } from "_/components/user/SelectCountry.js"
import { SubscriptionTotalPrice } from "_/components/user/SubscriptionTotalPrice.js"
import { AuthenticationContext } from "_/contexts/Authentication.js"
import { SubscriptionContext } from "_/contexts/user/Subscription.js"
import { useUserApi } from "_/hooks/useUserApi.js"
import { url } from "_/routing/user/URLs.js"
import {
	AllowedCountryIsoCode2,
	isAllowedCountryIsoCode2,
	monthlyPrice,
	purchaseCurrency,
	purchaseDefaultNumMonths as defaultNumMonths,
	purchaseMaxNumMonths as maxNumMonths,
	purchaseMinNumMonths as minNumMonths
} from "@workspace/models"
import { isMaybeObject, isNaturalNumber } from "@workspace/type-utils"
import { getTime, now } from "minimal-time-helpers"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

const fieldName = {
	country: "country"
}
// TODO  use Form
// const fields = Object.keys(fieldName)

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
