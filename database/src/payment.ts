import {
	DocumentProviderLevel2,
	PaymentAction,
	PaymentActionInput as Input,
	PaymentActionOutput as Output,
} from '@workspace/api'

import { pathname } from './locators.js'

export class PaymentDatabase implements PaymentAction {
	documentProvider: DocumentProviderLevel2

	constructor(documentProvider: DocumentProviderLevel2) {
		this.documentProvider = documentProvider
	}

	ReadSubscription({ accountId }: Input['ReadSubscription']) {
		return this.documentProvider.getItem<Output['ReadSubscription']>(
			pathname.subscription({ accountId })
		)
	}

	WriteSubscription({
		accountId,
		...subscription
	}: Input['WriteSubscription']) {
		return this.documentProvider.setItem(
			pathname.subscription({ accountId }),
			subscription
		)
	}

	WriteSubscriptionPurchase({
		accountId,
		day,
		purchaseId,
		...purchase
	}: Input['WriteSubscriptionPurchase']) {
		return this.documentProvider.setItem(
			pathname.subscriptionPurchase({ accountId, purchaseId, day }),
			purchase
		)
	}
}
