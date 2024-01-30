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

import { Action } from "./action.js"

export type ExecutorAction = {
	AppendStrategyDailyOrders: Action<
		StrategyDailyOrdersKey & { items: Order[] },
		void
	>
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

export type ExecutorActionInput = {
	AppendAccountDailyOrders: Parameters<
		ExecutorAction["AppendAccountDailyOrders"]
	>[0]
	AppendStrategyDailyOrders: Parameters<
		ExecutorAction["AppendStrategyDailyOrders"]
	>[0]
	ReadAccountStrategies: Parameters<
		ExecutorAction["ReadAccountStrategies"]
	>[0]
	ReadSubscription: Parameters<ExecutorAction["ReadSubscription"]>[0]
	SuspendAccountStrategyScheduling: Parameters<
		ExecutorAction["SuspendAccountStrategyScheduling"]
	>[0]
	SuspendAccountStrategySchedulings: Parameters<
		ExecutorAction["SuspendAccountStrategySchedulings"]
	>[0]
	SuspendAccountStrategiesSchedulings: Parameters<
		ExecutorAction["SuspendAccountStrategiesSchedulings"]
	>[0]
	UpdateAccountStrategySchedulingMemory: Parameters<
		ExecutorAction["UpdateAccountStrategySchedulingMemory"]
	>[0]
}
