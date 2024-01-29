import {
	AccountDailyOrder,
	AccountDailyOrdersKey,
	AccountKey,
	AccountStrategy,
	AccountStrategyItemKey,
	AccountStrategySchedulingKey,
	Order,
	StrategyDailyOrdersKey,
	StrategyMemory,
	Subscription
} from "@workspace/models"

type Action = {
	AppendStrategyDailyOrders: (
		arg: StrategyDailyOrdersKey & { items: Order[] }
	) => Promise<void>
	AppendAccountDailyOrders: (
		arg: AccountDailyOrdersKey & { items: AccountDailyOrder[] }
	) => Promise<void>
	ListAccountKeys: () => Promise<AccountKey[]>
	ReadAccountStrategies: (arg: AccountKey) => Promise<AccountStrategy[]>
	ReadSubscription: (arg: AccountKey) => Promise<Subscription | null>
	SuspendAccountStrategyScheduling: (
		arg: AccountStrategySchedulingKey
	) => Promise<void>
	SuspendAccountStrategySchedulings: (
		arg: AccountStrategyItemKey
	) => Promise<void>
	SuspendAccountStrategiesSchedulings: (arg: AccountKey) => Promise<void>
	UpdateAccountStrategySchedulingMemory: (
		arg: AccountStrategySchedulingKey & { memory: StrategyMemory }
	) => Promise<void>
}
export type ExecutorAction = Action

type Input = {
	AppendAccountDailyOrders: Parameters<Action["AppendAccountDailyOrders"]>[0]
	AppendStrategyDailyOrders: Parameters<
		Action["AppendStrategyDailyOrders"]
	>[0]
	ReadAccountStrategies: Parameters<Action["ReadAccountStrategies"]>[0]
	ReadSubscription: Parameters<Action["ReadSubscription"]>[0]
	SuspendAccountStrategyScheduling: Parameters<
		Action["SuspendAccountStrategyScheduling"]
	>[0]
	SuspendAccountStrategySchedulings: Parameters<
		Action["SuspendAccountStrategySchedulings"]
	>[0]
	SuspendAccountStrategiesSchedulings: Parameters<
		Action["SuspendAccountStrategiesSchedulings"]
	>[0]
	UpdateAccountStrategySchedulingMemory: Parameters<
		Action["UpdateAccountStrategySchedulingMemory"]
	>[0]
}
export type ExecutorActionInput = Input
