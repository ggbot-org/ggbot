import { useUserApi } from "_/hooks/useUserApi"
import { userDB } from "_/storages/userDB"
import {
	shouldPurchaseSubscription,
	statusOfSubscription,
	Subscription,
	SubscriptionPlan,
	SubscriptionStatus
} from "@workspace/models"
import { dayToTime, Time } from "minimal-time-helpers"
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react"

type ContextValue = Partial<{
	canPurchaseSubscription: boolean
	hasActiveSubscription: boolean
	subscriptionEnd: Time
	subscriptionStatus: SubscriptionStatus
	subscriptionPlan: SubscriptionPlan
}>

export const SubscriptionContext = createContext<ContextValue>({})

SubscriptionContext.displayName = "SubscriptionContext"

const subscriptionToContext = (
	subscription: Subscription | null | undefined
): ContextValue => {
	if (subscription === undefined) return {}
	if (subscription === null)
		return {
			canPurchaseSubscription: true,
			hasActiveSubscription: false
		}
	const subscriptionStatus = statusOfSubscription(subscription)
	return {
		canPurchaseSubscription: shouldPurchaseSubscription(subscription),
		hasActiveSubscription: subscriptionStatus === "active",
		subscriptionEnd: dayToTime(subscription.end),
		subscriptionStatus,
		subscriptionPlan: subscription.plan
	}
}

export const SubscriptionProvider: FC<PropsWithChildren> = ({ children }) => {
	const READ = useUserApi.ReadSubscription()
	const subscription = READ.data
	const [userDBIsOpen, setUserDBIsOpen] = useState(false)
	const [storedSubscription, setStoredSubscription] = useState<
		Subscription | null | undefined
	>()

	const onOpenUserDB = useCallback(() => {
		setUserDBIsOpen(true)
	}, [])

	const contextValue = useMemo<ContextValue>(() => {
		if (storedSubscription) return subscriptionToContext(storedSubscription)
		return subscriptionToContext(subscription)
	}, [subscription, storedSubscription])

	useEffect(() => {
		if (READ.canRun) READ.request()
	}, [READ])

	useEffect(() => {
		if (userDBIsOpen)
			userDB.readSubscription().then(setStoredSubscription).catch()
	}, [userDBIsOpen])

	useEffect(() => {
		userDB.writeSubscription(subscription)
	}, [subscription])

	useEffect(() => {
		userDB.addEventListener("open", onOpenUserDB)
		return () => {
			userDB.removeEventListener("open", onOpenUserDB)
		}
	}, [onOpenUserDB])

	return (
		<SubscriptionContext.Provider value={contextValue}>
			{children}
		</SubscriptionContext.Provider>
	)
}
