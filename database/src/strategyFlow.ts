import { UserApiDataProviderOperation as UserOperation } from "@workspace/api"
import {
	CopyStrategyFlow,
	createdNow,
	DeleteStrategyFlow,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	StrategyFlow,
	updatedNow
} from "@workspace/models"

import { DELETE, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"
import { PublicDataProvider } from "./public.js"
import { readStrategyAccountId } from "./strategy.js"

const publicDataProvider = new PublicDataProvider()

export const copyStrategyFlow: CopyStrategyFlow = async ({
	accountId,
	source: strategyKey,
	target
}) => {
	const strategyFlow = await publicDataProvider.readStrategyFlow(strategyKey)
	if (!strategyFlow)
		throw new ErrorStrategyItemNotFound({
			type: "StrategyFlow",
			...strategyKey
		})
	await writeStrategyFlow({
		accountId,
		view: strategyFlow.view,
		...target
	})
	return createdNow()
}

export const writeStrategyFlow: UserOperation["WriteStrategyFlow"] = async ({
	accountId,
	view,
	...strategyKey
}) => {
	const ownerId = await readStrategyAccountId(strategyKey)
	if (accountId !== ownerId)
		throw new ErrorPermissionOnStrategyItem({
			type: "StrategyFlow",
			action: "write",
			accountId,
			...strategyKey
		})
	const data: StrategyFlow = {
		view,
		...updatedNow()
	}
	return await UPDATE(pathname.strategyFlow(strategyKey), data)
}

export const deleteStrategyFlow: DeleteStrategyFlow = async ({
	accountId,
	...strategyKey
}) => {
	const ownerId = await readStrategyAccountId(strategyKey)
	if (accountId !== ownerId)
		throw new ErrorPermissionOnStrategyItem({
			type: "StrategyFlow",
			action: "delete",
			accountId,
			...strategyKey
		})
	return await DELETE(pathname.strategyFlow(strategyKey))
}
