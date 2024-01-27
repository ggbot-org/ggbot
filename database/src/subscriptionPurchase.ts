// TODO remove this file

// import {
// 	AccountKey,
// 	ErrorAccountItemNotFound,
// 	newMonthlySubscription,
// 	NewMonthlySubscriptionArg,
// 	newSubscriptionPurchaseKey,
// 	newYearlySubscription,
// 	NewYearlySubscriptionArg,
// 	SubscriptionPurchase,
// 	SubscriptionPurchaseKey,
// 	UpdateTime
// } from "@workspace/models"

// import { READ, UPDATE } from "./_dataBucket.js"
// import { pathname } from "./locators.js"

// type ReadSubscriptionPurchase = (
// 	arg: SubscriptionPurchaseKey
// ) => Promise<SubscriptionPurchase | null>

// export const readSubscriptionPurchase: ReadSubscriptionPurchase = (arg) =>
// 	READ<ReadSubscriptionPurchase>(pathname.subscriptionPurchase(arg))

// export const updateSubscriptionPurchaseInfo: (
// 	arg: SubscriptionPurchaseKey & Pick<SubscriptionPurchase, "info">
// ) => Promise<UpdateTime> = async ({ info, ...key }) => {
// 	const purchase = await readSubscriptionPurchase(key)
// 	if (!purchase)
// 		throw new ErrorAccountItemNotFound({
// 			accountId: key.accountId,
// 			type: "SubscriptionPurchase"
// 		})
// 	return await writeSubscriptionPurchase({
// 		...purchase,
// 		...key,
// 		info
// 	})
// }

// export const updateSubscriptionPurchaseStatus: (
// 	arg: SubscriptionPurchaseKey & Pick<SubscriptionPurchase, "status">
// ) => Promise<UpdateTime> = async ({ status, ...key }) => {
// 	const purchase = await readSubscriptionPurchase(key)
// 	if (!purchase)
// 		throw new ErrorAccountItemNotFound({
// 			accountId: key.accountId,
// 			type: "SubscriptionPurchase"
// 		})
// 	return await writeSubscriptionPurchase({
// 		...purchase,
// 		...key,
// 		status
// 	})
// }

// const writeNewSubscriptionPurchase = async ({
// 	accountId,
// 	purchase
// }: AccountKey & {
// 	purchase: SubscriptionPurchase
// }): Promise<SubscriptionPurchaseKey> => {
// 	const key = newSubscriptionPurchaseKey({
// 		accountId,
// 		purchaseId: purchase.id
// 	})
// 	await writeSubscriptionPurchase({ ...purchase, ...key })
// 	return key
// }

// type CreateMonthlySubscriptionPurchaseInput = AccountKey &
// 	NewMonthlySubscriptionArg

// /** Create a monthly subscription. */
// type CreateMonthlySubscriptionPurchase = (
// 	arg: CreateMonthlySubscriptionPurchaseInput
// ) => Promise<SubscriptionPurchaseKey>

// export const createMonthlySubscriptionPurchase: CreateMonthlySubscriptionPurchase =
// 	async ({ accountId, ...arg }) => {
// 		const purchase = newMonthlySubscription(arg)
// 		return await writeNewSubscriptionPurchase({ accountId, purchase })
// 	}

// /** Create a yearly subscription. */
// export const createYearlySubscriptionPurchase: (
// 	arg: AccountKey & NewYearlySubscriptionArg
// ) => Promise<SubscriptionPurchaseKey> = async ({ accountId, ...arg }) => {
// 	const purchase = newYearlySubscription(arg)
// 	return await writeNewSubscriptionPurchase({ accountId, purchase })
// }
