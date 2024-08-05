import { Account, AccountDailyKey, AccountDailyOrder, AccountKey, AccountStrategy, AccountStrategyDailyKey, AccountStrategyItemKey, AccountStrategySchedulingKey, BalanceEvent, Order, StrategyError, StrategyMemory, Subscription } from "@workspace/models"

import { Action } from "./action.js"

export type ExecutorAction = {
	AppendAccountBalanceEvent: (
		arg: AccountDailyKey & { item: BalanceEvent }
	) => Promise<void>
	AppendAccountDailyOrders: (
		arg: AccountDailyKey & { items: AccountDailyOrder[] }
	) => Promise<void>
	AppendStrategyDailyErrors: Action<
		AccountStrategyDailyKey & { items: StrategyError[] },
		void
	>
	AppendStrategyDailyOrders: Action<
		AccountStrategyDailyKey & { items: Order[] },
		void
	>
	ListAccountKeys: (arg: void) => Promise<AccountKey[]>
	ReadAccount: (arg: AccountKey) => Promise<Account | null>
	ReadAccountStrategies: (arg: AccountKey) => Promise<AccountStrategy[]>
	ReadSubscription: (arg: AccountKey) => Promise<Subscription | null>
	SuspendAccountStrategyScheduling: (
		arg: AccountStrategySchedulingKey
	) => Promise<void>
	SuspendAccountStrategySchedulings: (
		arg: AccountStrategyItemKey
	) => Promise<void>
	UpdateAccountStrategySchedulingMemory: (
		arg: AccountStrategySchedulingKey & { memory: StrategyMemory }
	) => Promise<void>
}

export type ExecutorActionInput = {
	AppendAccountBalanceEvent: Parameters<
		ExecutorAction["AppendAccountBalanceEvent"]
	>[0]
	AppendAccountDailyOrders: Parameters<
		ExecutorAction["AppendAccountDailyOrders"]
	>[0]
	AppendStrategyDailyErrors: Parameters<
		ExecutorAction["AppendStrategyDailyErrors"]
	>[0]
	AppendStrategyDailyOrders: Parameters<
		ExecutorAction["AppendStrategyDailyOrders"]
	>[0]
	ListAccountKeys: Parameters<ExecutorAction["ListAccountKeys"]>[0]
	ReadAccount: Parameters<ExecutorAction["ReadAccount"]>[0]
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
	UpdateAccountStrategySchedulingMemory: Parameters<
		ExecutorAction["UpdateAccountStrategySchedulingMemory"]
	>[0]
}

export type ExecutorActionOutput = {
	AppendAccountBalanceEvent: Awaited<
		ReturnType<ExecutorAction["AppendAccountBalanceEvent"]>
	>
	AppendAccountDailyOrders: Awaited<
		ReturnType<ExecutorAction["AppendAccountDailyOrders"]>
	>
	AppendStrategyDailyErrors: Awaited<
		ReturnType<ExecutorAction["AppendStrategyDailyErrors"]>
	>
	AppendStrategyDailyOrders: Awaited<
		ReturnType<ExecutorAction["AppendStrategyDailyOrders"]>
	>
	ListAccountKeys: Awaited<ReturnType<ExecutorAction["ListAccountKeys"]>>
	ReadAccountStrategies: Awaited<
		ReturnType<ExecutorAction["ReadAccountStrategies"]>
	>
	ReadAccount: Awaited<ReturnType<ExecutorAction["ReadAccount"]>>
	ReadSubscription: Awaited<ReturnType<ExecutorAction["ReadSubscription"]>>
	SuspendAccountStrategyScheduling: Awaited<
		ReturnType<ExecutorAction["SuspendAccountStrategyScheduling"]>
	>
	SuspendAccountStrategySchedulings: Awaited<
		ReturnType<ExecutorAction["SuspendAccountStrategySchedulings"]>
	>
	UpdateAccountStrategySchedulingMemory: Awaited<
		ReturnType<ExecutorAction["UpdateAccountStrategySchedulingMemory"]>
	>
}
