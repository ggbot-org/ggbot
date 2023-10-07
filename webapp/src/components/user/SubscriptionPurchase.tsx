import { Email } from "_/components/Email"
import {
	Button,
	Buttons,
	Checkmark,
	Column,
	Columns,
	Flex,
	Form,
	FormOnSubmit,
	formValues,
	Message,
	Title
} from "_/components/library"
import { SelectCountry } from "_/components/user/SelectCountry"
import {
	SubscriptionEnd,
	SubscriptionEndProps
} from "_/components/user/SubscriptionEnd"
import { SubscriptionNumMonths } from "_/components/user/SubscriptionNumMonths"
import { SubscriptionTotalPrice } from "_/components/user/SubscriptionTotalPrice"
import { AuthenticationContext } from "_/contexts/Authentication"
import { SubscriptionContext } from "_/contexts/user/Subscription"
import { url } from "_/routing/user/URLs"
import {
	isUtrustApiOrderResponseData,
	UtrustApiOrderRequestData
} from "@workspace/api"
import {
	isAllowedCountryIsoCode2,
	isNaturalNumber,
	monthlyPrice,
	purchaseCurrency,
	purchaseDefaultNumMonths as defaultNumMonths,
	purchaseMaxNumMonths as maxNumMonths,
	purchaseMinNumMonths as minNumMonths
} from "@workspace/models"
import { getTime, now } from "minimal-time-helpers"
import { FC, useCallback, useContext, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"

const fieldName = {
	country: "country",
	numMonths: "numMonths"
}
const fields = Object.keys(fieldName)

export const SubscriptionPurchase: FC = () => {
	const { formatNumber, formatMessage } = useIntl()

	const { accountEmail } = useContext(AuthenticationContext)
	const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd } =
		useContext(SubscriptionContext)

	const [purchaseIsPending, setPurchaseIsPending] = useState(false)
	const [numMonths, setNumMonths] = useState<number | undefined>(
		defaultNumMonths
	)

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

	let itemName = ""
	if (isYearlyPurchase)
		itemName = formatMessage({ id: "SubscriptionPurchase.yearlyItemName" })
	if (numMonths)
		itemName = formatMessage(
			{
				id: "SubscriptionPurchase.monthlyItemName"
			},
			{ numMonths }
		)

	const onSubmit = useCallback<FormOnSubmit>(
		async (event) => {
			event.preventDefault()
			if (!accountEmail) return
			if (purchaseIsPending) return

			const { country, numMonths } = formValues(event, fields)

			let purchaseIsDisabled = false
			if (!country) purchaseIsDisabled = true
			if (isNaturalNumber(numMonths)) {
				if (numMonths < minNumMonths) purchaseIsDisabled = true
				if (numMonths > maxNumMonths) purchaseIsDisabled = true
			}
			if (purchaseIsDisabled) return

			if (typeof numMonths !== "number") return
			if (!isAllowedCountryIsoCode2(country)) return

			const requestData: UtrustApiOrderRequestData = {
				country,
				email: accountEmail,
				itemName,
				numMonths,
				plan: "basic"
			}
			setPurchaseIsPending(true)

			try {
				const response = await fetch(url.apiPurchaseOrder, {
					body: JSON.stringify(requestData),
					credentials: "omit",
					headers: new Headers({
						Accept: "application/json",
						"Content-Type": "application/json"
					}),
					method: "POST"
				})
				if (response.ok) {
					const data = await response.json()
					if (isUtrustApiOrderResponseData(data))
						window.location.href = data.redirectUrl
				}
			} catch (error) {
				console.error(error)
				setPurchaseIsPending(false)
			}
		},
		[accountEmail, itemName, purchaseIsPending]
	)

	const formattedMonthlyPrice = formatNumber(monthlyPrice, {
		style: "currency",
		currency: purchaseCurrency
	})

	if (!canPurchaseSubscription) return null

	return (
		<Form box onSubmit={onSubmit}>
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

			<Email isStatic value={accountEmail} />

			<SelectCountry />

			<Columns>
				<Column isNarrow>
					<SubscriptionNumMonths
						name={fieldName.numMonths}
						setValue={setNumMonths}
						value={numMonths}
					/>
				</Column>

				<Column>
					<SubscriptionEnd isStatic value={newSubscriptionEnd} />
				</Column>
			</Columns>

			<SubscriptionTotalPrice numMonths={numMonths} />

			<Title size={5}>{itemName}</Title>

			<Buttons>
				<Button color="primary" isLoading={purchaseIsPending}>
					<FormattedMessage id="SubscriptionPurchase.button" />
				</Button>
			</Buttons>
		</Form>
	)
}
