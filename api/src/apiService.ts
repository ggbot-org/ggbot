import { JsonValue } from "type-fest"

export type ApiService<ActionType extends string, DataProvider> = {
	dataProvider: DataProvider
} & Record<ActionType, (arg: unknown) => Promise<JsonValue>>
