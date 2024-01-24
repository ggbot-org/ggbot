import { UserApiDataProviderOperation as UserOperation } from "@workspace/api"
import { CacheMap } from "@workspace/cache"
import { ENV } from "@workspace/env"
import {
	Account,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	frequenciesAreEqual,
	Frequency,
	newAccountStrategy,
	newStrategy,
	normalizeName,
	Strategy,
	StrategyKey,
	throwIfInvalidName
} from "@workspace/models"
// TODO database should not depend on this
import {
	getS3DataBucketName,
	S3DataBucketProvider
} from "@workspace/s3-data-bucket"

import { DELETE, WRITE } from "./_dataBucket.js"
import {
	deleteAccountStrategiesItem,
	insertAccountStrategiesItem,
	renameAccountStrategiesItem
} from "./accountStrategies.js"
import { pathname } from "./locators.js"
import { PublicDataProvider } from "./public.js"
import { copyStrategyFlow, deleteStrategyFlow } from "./strategyFlow.js"

const strategyAccountIdCache = new CacheMap<Account["id"]>()

const awsDataRegion = ENV.AWS_DATA_REGION()
const documentProvider = new S3DataBucketProvider(
	awsDataRegion,
	getS3DataBucketName(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN(), awsDataRegion)
)
const publicDataProvider = new PublicDataProvider(documentProvider)

export const createStrategy: UserOperation["CreateStrategy"] = async ({
	accountId,
	name,
	...rest
}) => {
	throwIfInvalidName(name)
	const strategy = newStrategy({
		accountId,
		name,
		...rest
	})
	const strategyKey = { strategyId: strategy.id, strategyKind: strategy.kind }
	await WRITE(pathname.strategy(strategyKey), strategy)
	const accountStrategy = newAccountStrategy({ name, ...strategyKey })
	await insertAccountStrategiesItem({ accountId, item: accountStrategy })
	return strategy
}

export const copyStrategy: UserOperation["CopyStrategy"] = async ({
	accountId,
	strategyId,
	strategyKind,
	name
}) => {
	const sourceStrategy = await readStrategyOrThrow({
		strategyId,
		strategyKind
	})

	const strategy = await createStrategy({
		accountId,
		kind: strategyKind,
		name,
		frequency: sourceStrategy.frequency
	})

	await copyStrategyFlow({
		accountId,
		source: { strategyId, strategyKind },
		target: {
			strategyId: strategy.id,
			strategyKind: strategy.kind
		}
	})

	return strategy
}

const readStrategyOrThrow = async (
	strategyKey: StrategyKey
): Promise<Strategy> => {
	const data = await publicDataProvider.readStrategy(strategyKey)
	if (!data)
		throw new ErrorStrategyItemNotFound({
			type: "Strategy",
			...strategyKey
		})
	return data
}

/** Get `accountId` of strategy. */
export const readStrategyAccountId = async (
	strategyKey: StrategyKey
): Promise<Account["id"] | null> => {
	const { strategyId } = strategyKey
	const cachedData = strategyAccountIdCache.get(strategyId)
	if (cachedData) return cachedData
	const { accountId } = await readStrategyOrThrow(strategyKey)
	strategyAccountIdCache.set(strategyId, accountId)
	return accountId
}

export const renameStrategy: UserOperation["RenameStrategy"] = async ({
	accountId,
	name,
	...strategyKey
}) => {
	throwIfInvalidName(name)
	const strategy = await readStrategyOrThrow(strategyKey)
	const normalizedName = normalizeName(name)
	const { strategyId } = strategyKey
	if (strategy.accountId === accountId) {
		const renamedStrategy = { ...strategy, name: normalizedName }
		await WRITE(pathname.strategy(strategyKey), renamedStrategy)
	}
	return await renameAccountStrategiesItem({
		accountId,
		strategyId,
		name: normalizedName
	})
}

export const deleteStrategy: UserOperation["DeleteStrategy"] = async (
	accountStrategyKey
) => {
	const { accountId, ...strategyKey } = accountStrategyKey
	const ownerId = await readStrategyAccountId(strategyKey)
	if (accountId !== ownerId)
		throw new ErrorPermissionOnStrategyItem({
			action: "delete",
			type: "Strategy",
			accountId,
			...strategyKey
		})
	await DELETE(pathname.strategy(strategyKey))
	await deleteStrategyFlow(accountStrategyKey)
	return await deleteAccountStrategiesItem(accountStrategyKey)
}

export const upsertStrategyFrequency = async ({
	frequency,
	...strategyKey
}: StrategyKey & { frequency: Frequency }): Promise<void> => {
	const strategy = await readStrategyOrThrow(strategyKey)
	if (frequenciesAreEqual(frequency, strategy.frequency)) return
	await WRITE(pathname.strategy(strategyKey), { ...strategy, frequency })
}
