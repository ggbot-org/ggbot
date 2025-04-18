import { getBinanceSymbolInfo } from '_/binance/getSymbolInfo'
import { classnames } from '_/classnames'
import {
	DateTime,
	Div,
	Level,
	LevelItem,
	SizeProp,
	Title,
} from '_/components/library'
import { useBinanceSymbols } from '_/hooks/useBinanceSymbols'
import { FormattedMessage } from '_/i18n/components'
import {
	add,
	BinanceFill,
	greaterThan,
	isBinanceFill,
	lessThan,
	mul,
	neg,
	sub,
} from '@workspace/binance'
import { Order, StrategyKind } from '@workspace/models'
import { DayInterval } from 'minimal-time-helpers'
import { arrayTypeGuard, objectTypeGuard } from 'minimal-type-guard-helpers'
import { Fragment, PropsWithChildren } from 'react'

function toNumber(value: string, precision: number) {
	return Number(value).toFixed(precision)
}

function Label({ children, size }: PropsWithChildren<SizeProp<'large'>>) {
	return (
		<p className={classnames({ 'is-size-6': size === 'large' })}>{children}</p>
	)
}

function Value({ children, size }: PropsWithChildren<SizeProp<'large'>>) {
	return children ? (
		<p
			className={classnames('has-text-weight-medium', {
				'is-size-5': size === undefined,
				'is-size-3': size === 'large',
			})}
		>
			{children}
		</p>
	) : (
		<>&nbsp;</>
	)
}

type Fee = {
	asset: string
	quantity: string
}

type SymbolStats = {
	symbol: string
	maxPrice: string
	minPrice: string
	baseQuantity: string
	quoteQuantity: string
}

type ProfitSummaryProps = {
	dayInterval: DayInterval | undefined
	orders: Order[] | undefined
	strategyKind: StrategyKind | undefined
}

export function ProfitSummary({
	orders,
	dayInterval,
	strategyKind,
}: ProfitSummaryProps) {
	const binanceSymbols = useBinanceSymbols(strategyKind)

	let numBuys: number | undefined = undefined
	let numSells: number | undefined = undefined

	const feesMap = new Map<Fee['asset'], Fee['quantity']>()
	const symbolStats = new Map<
		SymbolStats['symbol'],
		Omit<SymbolStats, 'symbol'>
	>()

	if (strategyKind === 'binance') {
		if (orders)
			for (const { info } of orders) {
				if (
					!objectTypeGuard<{
						fills: unknown[]
						side: string
						status: string
						symbol: string
						type: string
					}>(
						({ fills, side, status, symbol, type }) =>
							Array.isArray(fills) &&
							[side, status, symbol, type].every(
								(item) => typeof item === 'string'
							)
					)(info)
				)
					continue

				if (info.status !== 'FILLED') continue
				if (info.type !== 'MARKET') continue
				const { fills, side, symbol } = info

				const isBuy = side === 'BUY'

				// Count buys and sells.
				if (isBuy) numBuys === undefined ? (numBuys = 1) : numBuys++
				else numSells === undefined ? (numSells = 1) : numSells++

				if (!arrayTypeGuard<BinanceFill>(isBinanceFill)(fills)) continue

				for (const {
					commission,
					commissionAsset,
					price,
					qty: baseQty,
				} of fills) {
					const quoteQty = mul(price, baseQty)

					// Sum fees.
					const previousFees = feesMap.get(commissionAsset)
					if (previousFees)
						feesMap.set(commissionAsset, add(previousFees, commission))
					else feesMap.set(commissionAsset, commission)

					// Statistics.
					const previousSymbolStats = symbolStats.get(symbol)
					if (previousSymbolStats) {
						const { minPrice, maxPrice, baseQuantity, quoteQuantity } =
							previousSymbolStats
						symbolStats.set(symbol, {
							baseQuantity: isBuy
								? add(baseQuantity, baseQty)
								: sub(baseQuantity, baseQty),
							maxPrice: greaterThan(price, maxPrice) ? price : maxPrice,
							minPrice: lessThan(price, minPrice) ? price : minPrice,
							quoteQuantity: isBuy
								? sub(quoteQuantity, quoteQty)
								: add(quoteQuantity, quoteQty),
						})
					} else {
						symbolStats.set(symbol, {
							baseQuantity: isBuy ? baseQty : neg(baseQty),
							maxPrice: price,
							minPrice: price,
							quoteQuantity: isBuy ? neg(quoteQty) : quoteQty,
						})
					}
				}
			}
	}

	if (orders === undefined) return null
	if (orders.length === 0) return null

	return (
		<Div bulma="box">
			<Title>
				<FormattedMessage id="ProfitSummary.title" />
			</Title>
			<Level>
				<LevelItem>
					<Div bulma={['is-flex', 'is-flex-direction-column', 'mx-2']}>
						<Label>
							<FormattedMessage id="DailyInterval.from" />
						</Label>
						<Value>
							<DateTime format="day" value={dayInterval?.start} />
						</Value>
					</Div>
					<Div bulma={['is-flex', 'is-flex-direction-column', 'mx-2']}>
						<Label>
							<FormattedMessage id="DailyInterval.to" />
						</Label>
						<Value>
							<DateTime format="day" value={dayInterval?.end} />
						</Value>
					</Div>
				</LevelItem>
				<LevelItem bulma="has-text-centered">
					<div>
						<Label size="large">
							<FormattedMessage id="ProfitSummary.numBuys" />
						</Label>
						<Value size="large">{numBuys}</Value>
					</div>
				</LevelItem>
				<LevelItem bulma="has-text-centered">
					<div>
						<Label size="large">
							<FormattedMessage id="ProfitSummary.numSells" />
						</Label>
						<Value size="large">{numSells}</Value>
					</div>
				</LevelItem>
			</Level>
			{Array.from(symbolStats, ([symbol, stats]) => {
				const symbolInfo = getBinanceSymbolInfo(symbol, binanceSymbols)
				if (!symbolInfo)
					return {
						baseAsset: '',
						baseAssetPrecision: 0,
						quoteAsset: '',
						quoteAssetPrecision: 0,
						symbol,
						...stats,
					}
				const {
					baseAsset,
					baseAssetPrecision,
					quoteAsset,
					quoteAssetPrecision,
				} = symbolInfo
				return {
					baseAsset,
					baseAssetPrecision,
					quoteAsset,
					quoteAssetPrecision,
					symbol,
					...stats,
				}
			}).map(
				({
					baseAsset,
					baseAssetPrecision,
					baseQuantity,
					maxPrice,
					minPrice,
					quoteAsset,
					quoteAssetPrecision,
					quoteQuantity,
					symbol,
				}) => (
					<Fragment key={symbol}>
						<Level>
							<LevelItem>
								<Title is={4}>{symbol}</Title>
							</LevelItem>
							<LevelItem bulma="has-text-centered">
								<div>
									<Label size="large">{baseAsset}</Label>
									<Value size="large">
										{toNumber(baseQuantity, baseAssetPrecision)}
									</Value>
								</div>
							</LevelItem>
							<LevelItem bulma="has-text-centered">
								<div>
									<Label size="large">{quoteAsset}</Label>
									<Value size="large">
										{toNumber(quoteQuantity, quoteAssetPrecision)}
									</Value>
								</div>
							</LevelItem>
						</Level>
						<Level>
							<LevelItem bulma="has-text-centered">
								<div>
									<Label>
										<FormattedMessage id="ProfitSummary.minPrice" />
									</Label>
									<Value>{toNumber(minPrice, quoteAssetPrecision)}</Value>
								</div>
							</LevelItem>
							<LevelItem bulma="has-text-centered">
								<div>
									<Label>
										<FormattedMessage id="ProfitSummary.maxPrice" />
									</Label>
									<Value>{toNumber(maxPrice, quoteAssetPrecision)}</Value>
								</div>
							</LevelItem>
						</Level>
					</Fragment>
				)
			)}
			<Level>
				<LevelItem>
					<p>
						<FormattedMessage id="ProfitSummary.fees" />
					</p>
				</LevelItem>
				{Array.from(feesMap, ([asset, quantity]) => ({ asset, quantity })).map(
					({ asset, quantity }) => (
						<LevelItem key={asset} bulma="has-text-centered">
							<div>
								<Label>{asset}</Label>
								<Value>{quantity}</Value>
							</div>
						</LevelItem>
					)
				)}
			</Level>
		</Div>
	)
}
