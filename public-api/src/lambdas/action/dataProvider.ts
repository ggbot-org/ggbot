import { PublicApiDataProvider } from "@workspace/api"
import { readStrategy, readStrategyFlow } from "@workspace/database"

export const dataProvider: PublicApiDataProvider = {
	readStrategy,
	readStrategyFlow
}
