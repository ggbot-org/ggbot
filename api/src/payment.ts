import {
	AccountKey,
	Subscription,
	SubscriptionPurchase,
	SubscriptionPurchaseKey,
	UpdateTime
} from "@workspace/models"

type Action = {
	WriteSubscription: (arg: AccountKey & Subscription) => Promise<UpdateTime>
	WriteSubscriptionPurchase: (
		arg: SubscriptionPurchaseKey & SubscriptionPurchase
	) => Promise<UpdateTime>
}
export type PaymentAction = Action

type Input = {
	WriteSubscription: Parameters<Action["WriteSubscription"]>[0]
	WriteSubscriptionPurchase: Parameters<
		Action["WriteSubscriptionPurchase"]
	>[0]
}
export type PaymentActionInput = Input
