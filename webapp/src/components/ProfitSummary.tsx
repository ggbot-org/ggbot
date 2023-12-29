import { getBinanceSymbolInfo } from "_/binance/getSymbolInfo"
import { classNames } from "_/classNames"
import {
	Box,
	DateTime,
	Flex,
	Heading,
	Level,
	LevelItem,
	SizeModifierProp,
	Title
} from "_/components/library"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import {
	add,
	decimalToNumber,
	gt,
	lt,
	mul,
	neg,
	sub
} from "@workspace/arithmetic"
import { BinanceFill, isBinanceFill } from "@workspace/binance"
import { Order, StrategyKind } from "@workspace/models"
import { DayInterval } from "minimal-time-helpers"
import { arrayTypeGuard, objectTypeGuard } from "minimal-type-guard-helpers"
import { FC, Fragment, PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	dayInterval: DayInterval | undefined
	orders: Order[] | undefined
	strategyKind: StrategyKind | undefined
}

const _Label: FC<PropsWithChildren<SizeModifierProp<"large">>> = ({
	children,
	size
}) => (
	<Heading className={classNames({ "is-size-6": size === "large" })}>
		{children}
	</Heading>
)

const _Value: FC<PropsWithChildren<SizeModifierProp<"large">>> = ({
	children,
	size = "normal"
}) =>
	children ? (
		<p
			className={classNames("has-text-weight-medium", {
				"is-size-5": size === "normal",
				"is-size-3": size === "large"
			})}
		>
			{children}
		</p>
	) : (
		<>&nbsp;</>
	)

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

export const ProfitSummary: FC<Props> = ({
	orders,
	dayInterval,
	strategyKind
}) => {
	const binanceSymbols = useBinanceSymbols()

	let numBuys: number | undefined = undefined
	let numSells: number | undefined = undefined

	const fees = new Map<Fee["asset"], Fee["quantity"]>()
	const symbolStats = new Map<
		SymbolStats["symbol"],
		Omit<SymbolStats, "symbol">
	>()

	if (strategyKind === "binance") {
		if (orders)
			for (const { info } of orders) {
				if (
					objectTypeGuard<{
						fills: unknown[]
						side: string
						status: string
						symbol: string
						type: string
					}>(
						({ fills, side, status, symbol, type }) =>
							Array.isArray(fills) &&
							[side, status, symbol, type].every(
								(item) => typeof item === "string"
							)
					)(info)
				) {
					if (info.status !== "FILLED") continue
					if (info.type !== "MARKET") continue
					const { fills, side, symbol } = info

					const isBuy = side === "BUY"

					// Count buys and sells.
					if (isBuy) {
						numBuys === undefined ? (numBuys = 1) : numBuys++
					} else {
						numSells === undefined ? (numSells = 1) : numSells++
					}

					if (!arrayTypeGuard<BinanceFill>(isBinanceFill)(fills))
						continue

					for (const {
						commission,
						commissionAsset,
						price,
						qty: baseQty
					} of fills) {
						const quoteQty = mul(price, baseQty)

						// Sum fees.
						const previousFees = fees.get(commissionAsset)
						if (previousFees) {
							fees.set(
								commissionAsset,
								add(previousFees, commission)
							)
						} else {
							fees.set(commissionAsset, commission)
						}

						// Statistics.
						const previousSymbolStats = symbolStats.get(symbol)
						if (previousSymbolStats) {
							const {
								minPrice,
								maxPrice,
								baseQuantity,
								quoteQuantity
							} = previousSymbolStats
							symbolStats.set(symbol, {
								baseQuantity: isBuy
									? add(baseQuantity, baseQty)
									: sub(baseQuantity, baseQty),
								maxPrice: gt(price, maxPrice)
									? price
									: maxPrice,
								minPrice: lt(price, minPrice)
									? price
									: minPrice,
								quoteQuantity: isBuy
									? sub(quoteQuantity, quoteQty)
									: add(quoteQuantity, quoteQty)
							})
						} else {
							symbolStats.set(symbol, {
								baseQuantity: isBuy ? baseQty : neg(baseQty),
								maxPrice: price,
								minPrice: price,
								quoteQuantity: isBuy ? neg(quoteQty) : quoteQty
							})
						}
					}
				}
			}
	}

	return (
		<Box>
			<Title>
				<FormattedMessage id="ProfitSummary.title" />
			</Title>

			<Level>
				<LevelItem>
					<Flex direction="column" spacing={{ mx: 2 }}>
						<_Label>
							<FormattedMessage id="DailyInterval.from" />
						</_Label>

						<_Value>
							<DateTime format="day" value={dayInterval?.start} />
						</_Value>
					</Flex>

					<Flex direction="column" spacing={{ mx: 2 }}>
						<_Label>
							<FormattedMessage id="DailyInterval.to" />
						</_Label>

						<_Value>
							<DateTime format="day" value={dayInterval?.end} />
						</_Value>
					</Flex>
				</LevelItem>

				<LevelItem hasText="centered">
					<div>
						<_Label size="large">
							<FormattedMessage id="ProfitSummary.numBuys" />
						</_Label>

						<_Value size="large">{numBuys}</_Value>
					</div>
				</LevelItem>

				<LevelItem hasText="centered">
					<div>
						<_Label size="large">
							<FormattedMessage id="ProfitSummary.numSells" />
						</_Label>

						<_Value size="large">{numSells}</_Value>
					</div>
				</LevelItem>
			</Level>

			{Array.from(
				symbolStats,
				([
					symbol,
					{ baseQuantity, maxPrice, minPrice, quoteQuantity }
				]) => ({
					baseQuantity,
					maxPrice,
					minPrice,
					quoteQuantity,
					symbol
				})
			)
				.map(({ symbol, ...rest }) => {
					const symbolInfo = getBinanceSymbolInfo(
						symbol,
						binanceSymbols
					)
					if (!symbolInfo)
						return {
							baseAsset: "",
							baseAssetPrecision: undefined,
							quoteAsset: "",
							quoteAssetPrecision: undefined,
							symbol,
							...rest
						}
					const {
						baseAsset,
						baseAssetPrecision,
						quoteAsset,
						quoteAssetPrecision
					} = symbolInfo
					return {
						baseAsset,
						baseAssetPrecision,
						quoteAsset,
						quoteAssetPrecision,
						symbol,
						...rest
					}
				})
				.map(
					({
						baseAsset,
						baseAssetPrecision,
						baseQuantity,
						maxPrice,
						minPrice,
						quoteAsset,
						quoteAssetPrecision,
						quoteQuantity,
						symbol
					}) => (
						<Fragment key={symbol}>
							<Level>
								<LevelItem>
									<Title size={4}>{symbol}</Title>
								</LevelItem>

								<LevelItem hasText="centered">
									<div>
										<_Label size="large">
											{baseAsset}
										</_Label>

										<_Value size="large">
											{decimalToNumber(
												baseQuantity,
												baseAssetPrecision
											)}
										</_Value>
									</div>
								</LevelItem>

								<LevelItem hasText="centered">
									<div>
										<_Label size="large">
											{quoteAsset}
										</_Label>

										<_Value size="large">
											{decimalToNumber(
												quoteQuantity,
												quoteAssetPrecision
											)}
										</_Value>
									</div>
								</LevelItem>
							</Level>

							<Level>
								<LevelItem hasText="centered">
									<div>
										<_Label>
											<FormattedMessage id="ProfitSummary.minPrice" />
										</_Label>

										<_Value>
											{decimalToNumber(
												minPrice,
												quoteAssetPrecision
											)}
										</_Value>
									</div>
								</LevelItem>

								<LevelItem hasText="centered">
									<div>
										<_Label>
											<FormattedMessage id="ProfitSummary.maxPrice" />
										</_Label>

										<_Value>
											{decimalToNumber(
												maxPrice,
												quoteAssetPrecision
											)}
										</_Value>
									</div>
								</LevelItem>
							</Level>
						</Fragment>
					)
				)}

			<Level>
				<LevelItem>
					<Heading>
						<FormattedMessage id="ProfitSummary.fees" />
					</Heading>
				</LevelItem>

				{Array.from(fees, ([asset, quantity]) => ({
					asset,
					quantity
				})).map(({ asset, quantity }) => (
					<LevelItem key={asset} hasText="centered">
						<div>
							<_Label>{asset}</_Label>

							<_Value>{quantity}</_Value>
						</div>
					</LevelItem>
				))}
			</Level>
		</Box>
	)
}
