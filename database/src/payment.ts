import {
	PaymentAction,
	PaymentActionInput as Input,
	PaymentActionOutput as Output,
	DocumentProviderLevel2,
} from "@workspace/api"

import { pathname } from "./locators.js"

export class PaymentDatabase implements PaymentAction{
	documentProvider: DocumentProviderLevel2

	constructor(documentProvider: PaymentDatabase["documentProvider"]) {
		this.documentProvider = documentProvider
	}

	WriteSubscription( {accountId, ...subscription}: Input["WriteSubscription"]) {
		return this.documentProvider.setItem(pathname.subscription({accountId}), subscription)
	}

	WriteSubscriptionPurchase( {accountId, day, purchaseId, ...purchase}: Input["WriteSubscriptionPurchase"]) {
		return this.documentProvider.setItem(
			pathname.subscriptionPurchase({accountId, purchaseId, day}),purchase
		)
	}
}

