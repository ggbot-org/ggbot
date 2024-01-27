import {
	ApiActionInput,
	BinanceClientActionType,
	isBinanceClientActionInput as isInput
} from "@workspace/api"
import { BinanceDatabase } from "@workspace/database"
import { BadRequestError } from "@workspace/http"
import {
	AccountKey,
	ErrorAccountItemNotFound,
	ErrorUnknownItem,
	SerializableData
} from "@workspace/models"
import { documentProvider } from "@workspace/s3-data-bucket"

import { BinanceService } from "./binanceService.js"

export const binanceRequestHandler = async (
	{ accountId }: AccountKey,
	{ type, data }: ApiActionInput<BinanceClientActionType>
): Promise<SerializableData> => {
	const binanceDatabase = new BinanceDatabase({ accountId }, documentProvider)
	const binanceApiConfig = await binanceDatabase.ReadBinanceApiConfig()
	if (!binanceApiConfig)
		throw new ErrorAccountItemNotFound({
			type: "BinanceApiConfig",
			accountId
		})
	const { apiKey, apiSecret } = binanceApiConfig
	const service = new BinanceService(apiKey, apiSecret)

	if (type === "CreateBinanceOrder") {
		if (!isInput.CreateBinanceOrder(data)) throw new BadRequestError()
		return service.CreateBinanceOrder(data)
	}

	if (type === "ReadBinanceAccountApiRestrictions") {
		return service.ReadBinanceAccountApiRestrictions()
	}

	throw new ErrorUnknownItem("BinanceClientActionType", type)
}
