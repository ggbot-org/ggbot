// TODO
// import {
// 	AccountKey,
// 	isAccountKey,
// 	isSubscription,
// 	isSubscriptionPurchase,
// 	isSubscriptionPurchaseKey,
// 	Subscription,
// 	SubscriptionPurchase,
// 	SubscriptionPurchaseKey,
// 	UpdateTime
// } from "@workspace/models"
// import { objectTypeGuard } from "minimal-type-guard-helpers"

// type Action = {
// 	WriteSubscription: (arg: AccountKey & Subscription) => Promise<UpdateTime>
// 	WriteSubscriptionPurchase: (
// 		arg: SubscriptionPurchaseKey & SubscriptionPurchase
// 	) => Promise<UpdateTime>
// }
// export type PaymentAction = Action

// export type PaymentActionType = keyof Action

// type Input = {
// 	WriteSubscription: Parameters<Action["WriteSubscription"]>[0]
// 	WriteSubscriptionPurchase: Parameters<
// 		Action["WriteSubscriptionPurchase"]
// 	>[0]
// }
// export type PaymentActionInput = Input

// type Output = {
// 	WriteSubscription: Awaited<ReturnType<Action["WriteSubscription"]>>
// 	WriteSubscriptionPurchase: Awaited<
// 		ReturnType<Action["WriteSubscriptionPurchase"]>
// 	>
// }
// export type PaymentActionOutput = Output

// export const isPaymentActionInput = {
// 	WriteSubscription: objectTypeGuard<Input["WriteSubscription"]>(
// 		({ accountId, ...subscription }) =>
// 			isAccountKey({ accountId }) && isSubscription(subscription)
// 	),
// 	WriteSubscriptionPurchase: objectTypeGuard<
// 		Input["WriteSubscriptionPurchase"]
// 	>(
// 		({ accountId, day, purchaseId, ...subscriptionPurchase }) =>
// 			isSubscriptionPurchaseKey({ accountId, day, purchaseId }) &&
// 			isSubscriptionPurchase(subscriptionPurchase)
// 	)
// }
