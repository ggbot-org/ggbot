import {
	createdNow,
	DeleteAccountStrategiesItem,
	deletedNow,
	ErrorExceededQuota,
	InsertAccountStrategiesItem,
	isAccountStrategies,
	quota,
	ReadAccountStrategies,
	RenameAccountStrategiesItem,
	SuspendAccountStrategiesSchedulings,
	SuspendAccountStrategySchedulings,
	WriteAccountStrategiesItemSchedulings
} from "@workspace/models"

import { READ_ARRAY, UPDATE, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"
import { readSubscription } from "./subscription.js"

export const readAccountStrategies: ReadAccountStrategies = (arg) =>
	READ_ARRAY<ReadAccountStrategies>(
		isAccountStrategies,
		pathname.accountStrategies(arg)
	)

export const insertAccountStrategiesItem: InsertAccountStrategiesItem = async ({
	accountId,
	item
}) => {
	const items = (await readAccountStrategies({ accountId })) ?? []
	const subscription = await readSubscription({ accountId })

	const numMaxStrategies = quota.MAX_STRATEGIES_PER_ACCOUNT(
		subscription?.plan
	)
	if (items.length >= numMaxStrategies)
		throw new ErrorExceededQuota({ type: "MAX_STRATEGIES_PER_ACCOUNT" })
	const data = [...items, item]
	const Key = pathname.accountStrategies({ accountId })
	await WRITE(Key, data)
	return createdNow()
}

export const renameAccountStrategiesItem: RenameAccountStrategiesItem = async ({
	accountId,
	strategyId,
	name
}) => {
	const items = (await readAccountStrategies({ accountId })) ?? []
	const data = items.map((item) => {
		if (item.strategyId !== strategyId) return item
		return { ...item, name }
	})
	return await UPDATE(pathname.accountStrategies({ accountId }), data)
}

export const writeAccountStrategiesItemSchedulings: WriteAccountStrategiesItemSchedulings =
	async ({ accountId, strategyId, schedulings }) => {
		const items = (await readAccountStrategies({ accountId })) ?? []
		const data = items.map((item) => {
			if (item.strategyId !== strategyId) return item
			return { ...item, schedulings }
		})
		return await UPDATE(pathname.accountStrategies({ accountId }), data)
	}

export const deleteAccountStrategiesItem: DeleteAccountStrategiesItem = async ({
	accountId,
	strategyId
}) => {
	const items = (await readAccountStrategies({ accountId })) ?? []
	const data = items.filter((item) => item.strategyId !== strategyId)
	if (data.length !== items.length) {
		await WRITE(pathname.accountStrategies({ accountId }), data)
	}
	return deletedNow()
}

export const suspendAccountStrategiesSchedulings: SuspendAccountStrategiesSchedulings =
	async ({ accountId }) => {
		const items = (await readAccountStrategies({ accountId })) ?? []
		const data = items.map((item) => ({
			...item,
			schedulings: item.schedulings.map(
				({ status: _status, ...scheduling }) => ({
					...scheduling,
					status: "suspended"
				})
			)
		}))
		return await UPDATE(pathname.accountStrategies({ accountId }), data)
	}

export const suspendAccountStrategySchedulings: SuspendAccountStrategySchedulings =
	async ({ accountId, strategyId }) => {
		const items = (await readAccountStrategies({ accountId })) ?? []
		const data = items.map((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map(
							({ status: _status, ...scheduling }) => ({
								...scheduling,
								status: "suspended"
							})
					  )
					: item.schedulings
		}))
		return await UPDATE(pathname.accountStrategies({ accountId }), data)
	}
