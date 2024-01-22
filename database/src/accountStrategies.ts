import { UserApiDataProviderOperation as Operation } from "@workspace/api"
import {
	AccountKey,
	accountStrategiesModifier,
	AccountStrategy,
	AccountStrategyItemKey,
	AccountStrategySchedulingKey,
	createdNow,
	CreationTime,
	deletedNow,
	DeletionTime,
	Frequency,
	StrategyMemory,
	UpdateTime} from "@workspace/models"

import { READ_ARRAY, UPDATE, WRITE } from "./_dataBucket.js"
import { pathname } from "./locators.js"
import { upsertStrategyFrequency } from "./strategy.js"
import { readSubscription } from "./subscription.js"

export const readAccountStrategies: Operation["ReadAccountStrategies"] = (
	arg
) =>
	READ_ARRAY<Operation["ReadAccountStrategies"]>(
		pathname.accountStrategies(arg)
	)

type InsertAccountStrategiesItem = (
	arg: AccountKey & { item: AccountStrategy }
) => Promise<CreationTime>

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

type RenameAccountStrategiesItem = (
	arg: AccountStrategyItemKey & Pick<AccountStrategy, "name">
) => Promise<UpdateTime>

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

export const writeAccountStrategiesItemSchedulings: Operation["WriteAccountStrategiesItemSchedulings"] =
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

export type DeleteAccountStrategiesItem = (
	arg: AccountStrategyItemKey
) => Promise<DeletionTime>

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

export type SuspendAccountStrategiesSchedulings = (
	arg: AccountKey
) => Promise<UpdateTime>

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

export type SuspendAccountStrategyScheduling = (
	arg: AccountStrategySchedulingKey
) => Promise<UpdateTime>

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

export type SuspendAccountStrategySchedulings = (
	arg: AccountStrategyItemKey
) => Promise<UpdateTime>

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

export type UpdateAccountStrategySchedulingMemory = (
	arg: AccountStrategySchedulingKey & { memory: StrategyMemory }
) => Promise<UpdateTime>

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
