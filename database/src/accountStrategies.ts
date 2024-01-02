import {
	accountStrategiesModifier,
	AccountStrategy,
	createdNow,
	DeleteAccountStrategiesItem,
	deletedNow,
	Frequency,
	InsertAccountStrategiesItem,
	ReadAccountStrategies,
	RenameAccountStrategiesItem,
	SuspendAccountStrategiesSchedulings,
	SuspendAccountStrategyScheduling,
	SuspendAccountStrategySchedulings,
	UpdateAccountStrategySchedulingMemory,
	WriteAccountStrategiesItemSchedulings
} from "@workspace/models"

import { READ_ARRAY, UPDATE, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"
import { upsertStrategyFrequency } from "./strategy.js"
import { readSubscription } from "./subscription.js"

export const readAccountStrategies: ReadAccountStrategies = (arg) =>
	READ_ARRAY<ReadAccountStrategies>(pathname.accountStrategies(arg))

export const insertAccountStrategiesItem: InsertAccountStrategiesItem = async ({
	accountId,
	item
}) => {
	const items = await readAccountStrategies({ accountId })
	const subscription = await readSubscription({ accountId })
	const data = accountStrategiesModifier.insertItem(
		items,
		item,
		subscription?.plan
	)
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
	async ({ accountId, strategyId, strategyKind, schedulings }) => {
		const items = (await readAccountStrategies({ accountId })) ?? []
		const data: AccountStrategy[] = []
		let suggestedFrequency: Frequency | undefined
		for (const item of items) {
			if (item.strategyId !== strategyId) {
				data.push(item)
				continue
			}
			data.push({ ...item, schedulings })
			// Use first frequency as `suggestedFrequency`.
			suggestedFrequency = schedulings[0]?.frequency
		}
		if (suggestedFrequency)
			await upsertStrategyFrequency({
				strategyId,
				strategyKind,
				frequency: suggestedFrequency
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

export const suspendAccountStrategyScheduling: SuspendAccountStrategyScheduling =
	async ({ accountId, strategyId, schedulingId }) => {
		const items = (await readAccountStrategies({ accountId })) ?? []
		const data = items.map((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map(({ status, ...scheduling }) => ({
							...scheduling,
							status:
								schedulingId === scheduling.id
									? "suspended"
									: status
					  }))
					: item.schedulings
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

export const updateAccountStrategySchedulingMemory: UpdateAccountStrategySchedulingMemory =
	async ({ accountId, strategyId, schedulingId, memory }) => {
		const items = (await readAccountStrategies({ accountId })) ?? []
		const data = items.map((item) => ({
			...item,
			schedulings:
				item.strategyId === strategyId
					? item.schedulings.map((scheduling) => ({
							...scheduling,
							memory:
								schedulingId === scheduling.id
									? memory
									: scheduling.memory
					  }))
					: item.schedulings
		}))
		return await UPDATE(pathname.accountStrategies({ accountId }), data)
	}
