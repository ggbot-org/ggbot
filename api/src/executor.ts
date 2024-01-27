import {
	AccountDailyOrder,
	AccountDailyOrdersKey,
	Order,
	StrategyDailyOrdersKey
} from "@workspace/models"

type Action = {
	AppendStrategyDailyOrders: (
		arg: StrategyDailyOrdersKey & { items: Order[] }
	) => Promise<void>
	AppendAccountDailyOrders: (
		arg: AccountDailyOrdersKey & { items: AccountDailyOrder[] }
	) => Promise<void>
}
export type ExecutorAction = Action

export type ExecutorActionType = keyof Action

type Input = {
	AppendAccountDailyOrders: Parameters<Action["AppendAccountDailyOrders"]>[0]
	AppendStrategyDailyOrders: Parameters<
		Action["AppendStrategyDailyOrders"]
	>[0]
}
export type ExecutorActionInput = Input
