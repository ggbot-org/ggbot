import { UserApiDataProviderOperation as UserOperation } from "@workspace/api"
import { ENV } from "@workspace/env"
import {
	CopyStrategyFlow,
	createdNow,
	DeleteStrategyFlow,
	ErrorPermissionOnStrategyItem,
	ErrorStrategyItemNotFound,
	StrategyFlow,
	updatedNow
} from "@workspace/models"
// TODO database should not depend on this
import {
	getS3DataBucketName,
	S3DataBucketProvider
} from "@workspace/s3-data-bucket"

import { DELETE, UPDATE } from "./_dataBucket.js"
import { pathname } from "./locators.js"
import { PublicDataProvider } from "./public.js"
import { readStrategyAccountId } from "./strategy.js"

const awsDataRegion = ENV.AWS_DATA_REGION()
const documentProvider = new S3DataBucketProvider(
	awsDataRegion,
	getS3DataBucketName(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN(), awsDataRegion)
)
const publicDataProvider = new PublicDataProvider(documentProvider)

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
