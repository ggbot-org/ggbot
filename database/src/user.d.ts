import { DocumentProviderLevel2, UserDatabaseAction, UserDatabaseActionInput as Input } from '@workspace/api'
import { AccountKey, AccountStrategy, BalanceEvent, Order, Strategy, StrategyError } from '@workspace/models'

import { BinanceDatabase } from './binance'
import { PublicDatabase } from './public'

export declare class UserDatabase implements UserDatabaseAction {
	accountKey: AccountKey
	documentProvider: DocumentProviderLevel2
	binanceDatabase: BinanceDatabase
	publicDatabase: PublicDatabase
	constructor(accountKey: AccountKey, documentProvider: DocumentProviderLevel2)
	CopyStrategy({ strategyId, strategyKind, name }: Input['CopyStrategy']): Promise<{
		strategyId: Strategy['id'];
		strategyKind: Strategy['kind'];
	}>
	CreateBinanceApiConfig(arg: Input['CreateBinanceApiConfig']): Promise<import('@workspace/models').CreationTime>
	CreatePurchaseOrder(): Promise<null>
	CreateStrategy({ name, ...rest }: Input['CreateStrategy']): Promise<{
		strategyId: Strategy['id'];
		strategyKind: Strategy['kind'];
	}>
	/**
	 * Delete account related files.
	 *
	 * @remarks
	 * It keeps account related file in `emailAccount/` in case a user wants to
	 * recover a deleted account, it will be possible to do that if same email
	 * is used.
	 */
	DeleteAccount(): Promise<import('@workspace/models').DeletionTime>
	DeleteBinanceApiConfig(): Promise<import('@workspace/models').DeletionTime>
	/**
	 * Delete strategy from `accountStrategies` list.
	 *
	 * @remarks
	 * The `strategy` file is **not** deleted: it may be referenced by some
	 * order or other data.
	 */
	DeleteStrategy(strategyKey: Input['DeleteStrategy']): Promise<import('@workspace/models').DeletionTime>
	ReadAccountInfo(): Promise<{
		id: string;
		whenCreated: import('minimal-time-helpers').Time;
		email: import('@workspace/models').EmailAddress;
		role?: ('admin' | 'user') | undefined;
		subscription: import('@workspace/models').Subscription | null;
	}>
	ReadBalances({ start, end }: Input['ReadBalances']): Promise<BalanceEvent[]>
	ReadBinanceApiKey(): Promise<{ apiKey: string; } | null>
	ReadStrategies(): Promise<AccountStrategy[]>
	ReadStrategyErrors({ start, end, ...strategyKey }: Input['ReadStrategyErrors']): Promise<StrategyError[]>
	ReadStrategyOrders({ start, end, ...strategyKey }: Input['ReadStrategyOrders']): Promise<Order[]>
	ReadSubscription(): Promise<import('@workspace/models').Subscription | null>
	RenameStrategy({ name: newName, strategyId, strategyKind }: Input['RenameStrategy']): Promise<import('@workspace/models').UpdateTime>
	WriteAccountStrategiesItemSchedulings({ schedulings, strategyId, strategyKind }: Input['WriteAccountStrategiesItemSchedulings']): Promise<import('@workspace/models').UpdateTime>
	WriteStrategyFlow({ view, strategyId, strategyKind }: Input['WriteStrategyFlow']): Promise<import('@workspace/models').UpdateTime>
}
