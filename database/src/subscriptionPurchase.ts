import {
	AccountKey,
	CreateMonthlySubscriptionPurchase,
	CreateYearlySubscriptionPurchase,
	ErrorAccountItemNotFound,
	isSubscriptionPurchase,
	newMonthlySubscription,
	newSubscriptionPurchaseKey,
	newYearlySubscription,
	ReadSubscriptionPurchase,
	SubscriptionPurchase,
	SubscriptionPurchaseKey,
	UpdateSubscriptionPurchaseInfo,
	UpdateSubscriptionPurchaseStatus,
	WriteSubscriptionPurchase
} from "@workspace/models"

import { READ, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"

export const readSubscriptionPurchase: ReadSubscriptionPurchase = (arg) =>
	READ<ReadSubscriptionPurchase>(
		isSubscriptionPurchase,
		pathname.subscriptionPurchase(arg)
	)

const writeSubscriptionPurchase: WriteSubscriptionPurchase = ({
	accountId,
	purchaseId,
	day,
	...purchase
}) =>
	UPDATE(
		pathname.subscriptionPurchase({ accountId, purchaseId, day }),
		purchase
	)

export const updateSubscriptionPurchaseInfo: UpdateSubscriptionPurchaseInfo =
	async ({ info, ...key }) => {
		const purchase = await readSubscriptionPurchase(key)
		if (!purchase)
			throw new ErrorAccountItemNotFound({
				accountId: key.accountId,
				type: "SubscriptionPurchase"
			})
		return await writeSubscriptionPurchase({
			...purchase,
			...key,
			info
		})
	}

export const updateSubscriptionPurchaseStatus: UpdateSubscriptionPurchaseStatus =
	async ({ status, ...key }) => {
		const purchase = await readSubscriptionPurchase(key)
		if (!purchase)
			throw new ErrorAccountItemNotFound({
				accountId: key.accountId,
				type: "SubscriptionPurchase"
			})
		return await writeSubscriptionPurchase({
			...purchase,
			...key,
			status
		})
	}

const writeNewSubscriptionPurchase = async ({
	accountId,
	purchase
}: AccountKey & {
	purchase: SubscriptionPurchase
}): Promise<SubscriptionPurchaseKey> => {
	const key = newSubscriptionPurchaseKey({
		accountId,
		purchaseId: purchase.id
	})
	await writeSubscriptionPurchase({ ...purchase, ...key })
	return key
}

export const createMonthlySubscriptionPurchase: CreateMonthlySubscriptionPurchase =
	async ({ accountId, ...arg }) => {
		const purchase = newMonthlySubscription(arg)
		return await writeNewSubscriptionPurchase({ accountId, purchase })
	}

export const createYearlySubscriptionPurchase: CreateYearlySubscriptionPurchase =
	async ({ accountId, ...arg }) => {
		const purchase = newYearlySubscription(arg)
		return await writeNewSubscriptionPurchase({ accountId, purchase })
	}
