import {
	AccountKey,
	Subscription,
	SubscriptionPurchase,
	SubscriptionPurchaseKey,
	UpdateTime,
} from '@workspace/models'

export type PaymentAction = {
	ReadSubscription: (arg: AccountKey) => Promise<Subscription | null>
	WriteSubscription: (arg: AccountKey & Subscription) => Promise<UpdateTime>
	WriteSubscriptionPurchase: (
		arg: SubscriptionPurchaseKey & SubscriptionPurchase
	) => Promise<UpdateTime>
}

export type PaymentActionInput = {
	ReadSubscription: Parameters<PaymentAction['ReadSubscription']>[0]
	WriteSubscription: Parameters<PaymentAction['WriteSubscription']>[0]
	WriteSubscriptionPurchase: Parameters<
		PaymentAction['WriteSubscriptionPurchase']
	>[0]
}

export type PaymentActionOutput = {
	ReadSubscription: Awaited<ReturnType<PaymentAction['ReadSubscription']>>
	WriteSubscription: Awaited<ReturnType<PaymentAction['WriteSubscription']>>
	WriteSubscriptionPurchase: Awaited<
		ReturnType<PaymentAction['WriteSubscriptionPurchase']>
	>
}
