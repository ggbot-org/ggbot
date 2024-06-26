import {
	Button,
	Buttons,
	Column,
	Columns,
	Form,
	formValues,
	Message,
	Title
} from "_/components/library"
import {
	SubscriptionEnd,
	SubscriptionEndProps
} from "_/components/user/SubscriptionEnd"
import { SubscriptionNumMonths } from "_/components/user/SubscriptionNumMonths"
import { SubscriptionTotalPrice } from "_/components/user/SubscriptionTotalPrice"
import { AuthenticationContext } from "_/contexts/Authentication"
import { useStripeApi } from "_/hooks/useStripeApi"
import { useSubscription } from "_/hooks/useSubscription"
import { GOTO } from "_/routing/navigation"
import {
	isNaturalNumber,
	purchaseDefaultNumMonths as defaultNumMonths,
	purchaseMaxNumMonths as maxNumMonths,
	purchaseMinNumMonths as minNumMonths,
	SubscriptionPlan
} from "@workspace/models"
import { isYearlyPurchase } from "@workspace/models"
import { getTime, now } from "minimal-time-helpers"
import {
	FC,
	FormEventHandler,
	useCallback,
	useContext,
	useEffect,
	useState
} from "react"
import { FormattedMessage, useIntl } from "react-intl"

const fieldName = {
	numMonths: "numMonths"
}
const fields = Object.keys(fieldName)

export const SubscriptionPurchase: FC = () => {
	const { formatNumber, formatMessage } = useIntl()

	const { accountEmail } = useContext(AuthenticationContext)

	const { canPurchaseSubscription, hasActiveSubscription, subscriptionEnd } =
		useSubscription()

	const [numMonths, setNumMonths] = useState<number | undefined>(
		defaultNumMonths
	)

	const subscriptionPlan: SubscriptionPlan = "basic"
	const monthlyPrice = Number(STRIPE_PLAN_BASIC_MONTHLY_PRICE)
	const currency = "EUR"

	const CREATE_CHECKOUT = useStripeApi.CreateCheckoutSession()
	const { data: checkoutData, isPending } = CREATE_CHECKOUT

	let newSubscriptionEnd: SubscriptionEndProps["value"]
	if (isNaturalNumber(numMonths)) {
		const start = subscriptionEnd
			? getTime(subscriptionEnd).plusOne.day
			: now()
		newSubscriptionEnd = getTime(start).plus(
			numMonths >= maxNumMonths - 1 ? maxNumMonths : numMonths
		).months
	}

	const isYearly = isYearlyPurchase({ numMonths })

	let itemName = ""
	if (isYearly) {
		itemName = formatMessage({ id: "SubscriptionPurchase.yearlyItemName" })
	} else if (numMonths)
		itemName = formatMessage(
			{
				id: "SubscriptionPurchase.monthlyItemName"
			},
			{ numMonths }
		)

	const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
		(event) => {
			event.preventDefault()
			if (!CREATE_CHECKOUT.canRun) return

			const { numMonths: numMonthsStr } = formValues(event, fields)

			const numMonths = Number(numMonthsStr)

			let purchaseIsDisabled = false
			if (isNaturalNumber(numMonths)) {
				if (numMonths < minNumMonths) purchaseIsDisabled = true
				if (numMonths > maxNumMonths) purchaseIsDisabled = true
			}
			if (purchaseIsDisabled) return

			if (typeof numMonths !== "number") return

			CREATE_CHECKOUT.request({
				email: accountEmail,
				numMonths,
				plan: subscriptionPlan
			})
		},
		[CREATE_CHECKOUT, accountEmail]
	)

	const formattedMonthlyPrice = formatNumber(monthlyPrice, {
		style: "currency",
		currency
	})

	useEffect(() => {
		if (!checkoutData) return
		GOTO(new URL(checkoutData.url))
	}, [checkoutData])

	useEffect(() => {
		if (CREATE_CHECKOUT.isDone) CREATE_CHECKOUT.reset()
	}, [CREATE_CHECKOUT])

	if (canPurchaseSubscription === undefined || !canPurchaseSubscription)
		return null

	return (
		<Columns>
			<Column isNarrow>
				<Form box onSubmit={onSubmit}>
					<Title>
						<FormattedMessage id="SubscriptionPurchase.title" />
					</Title>

					<Title size={5}>{itemName}</Title>

					{hasActiveSubscription ? (
						<Message color="danger">
							<FormattedMessage id="SubscriptionPurchase.couldRenew" />
						</Message>
					) : (
						<Message color="info">
							<FormattedMessage id="SubscriptionPurchase.pleasePurchase" />

							<br />

							<FormattedMessage id="SubscriptionPurchase.purchaseCurrency" />
						</Message>
					)}

					<Message>
						<FormattedMessage
							id="SubscriptionPurchase.oneMonthPrice"
							values={{ price: formattedMonthlyPrice }}
						/>

						<br />

						<FormattedMessage
							id="SubscriptionPurchase.hint"
							values={{
								numMonths: maxNumMonths,
								em: (chunks) => <em>{chunks}</em>
							}}
						/>
					</Message>

					<Columns isMobile>
						<Column isNarrow>
							<SubscriptionNumMonths
								name={fieldName.numMonths}
								isYearlyPurchase={isYearly}
								setValue={setNumMonths}
								value={numMonths}
							/>
						</Column>

						<Column>
							<SubscriptionEnd
								isStatic
								value={newSubscriptionEnd}
							/>
						</Column>
					</Columns>

					<SubscriptionTotalPrice
						currency={currency}
						monthlyPrice={monthlyPrice}
						numMonths={numMonths}
					/>

					<Buttons>
						<Button
							color="primary"
							isOutlined={!isYearly}
							isLoading={isPending}
						>
							<FormattedMessage id="SubscriptionPurchase.button" />
						</Button>
					</Buttons>
				</Form>
			</Column>
		</Columns>
	)
}
