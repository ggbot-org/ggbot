import { Message, Table } from "_/components/library"
import { timeFormat } from "_/i18n/formats"
import {
	add,
	BinanceDecimal,
	BinanceFill,
	isBinanceFill
} from "@workspace/binance"
import { Order } from "@workspace/models"
import { arrayTypeGuard, objectTypeGuard } from "minimal-type-guard-helpers"
import { FormattedMessage, useIntl } from "react-intl"

type Row = {
	orderId: number
	side: string
	symbol: string
	time: string
	baseQuantity: string
	quoteQuantity: string
	price: string
}

type Props = {
	orders: Order[] | undefined
}

export function StrategyOrdersTable({ orders }: Props) {
	const { formatDate } = useIntl()

	const rows: Row[] = []
	if (orders)
		for (const { info } of orders) {
			if (
				!objectTypeGuard<{
					cummulativeQuoteQty: string
					executedQty: string
					fills: unknown[]
					orderId: number
					side: string
					symbol: string
					transactTime: number
				}>(
					({
						cummulativeQuoteQty,
						executedQty,
						fills,
						orderId,
						side,
						symbol,
						transactTime
					}) =>
						Array.isArray(fills) &&
						[cummulativeQuoteQty, executedQty, side, symbol].every(
							(item) => typeof item === "string"
						) &&
						[orderId, transactTime].every(
							(item) => typeof item === "number"
						)
				)(info)
			)
				continue

			const {
				cummulativeQuoteQty,
				executedQty,
				fills,
				orderId,
				side,
				symbol,
				transactTime
			} = info

			let price: BinanceDecimal = "0"
			const precision = 8

			if (arrayTypeGuard<BinanceFill>(isBinanceFill)(fills)) {
				const numFills = fills.length
				if (numFills === 1) {
					price = fills[0].price
				} else {
					let sumFillPrice = "0"
					for (const fill of fills)
						sumFillPrice = add(sumFillPrice, fill.price, precision)
					price = (Number(sumFillPrice) / fills.length).toFixed(
						precision
					)
				}
			}

			rows.push({
				side,
				orderId,
				symbol,
				time: formatDate(transactTime, timeFormat),
				baseQuantity: executedQty,
				quoteQuantity: cummulativeQuoteQty,
				price
			})
		}

	if (!orders) return null

	if (orders.length === 0)
		return (
			<Message>
				<FormattedMessage id="StrategyOrders.noOrder" />
			</Message>
		)

	return (
		<Table>
			<thead>
				<tr>
					<th>
						<FormattedMessage id="StrategyOrders.time" />
					</th>

					<th>
						<FormattedMessage id="StrategyOrders.side" />
					</th>

					<th>
						<FormattedMessage id="StrategyOrders.symbol" />
					</th>

					<th>
						<FormattedMessage id="StrategyOrders.baseQuantity" />
					</th>

					<th>
						<FormattedMessage id="StrategyOrders.quoteQuantity" />
					</th>

					<th>
						<FormattedMessage id="StrategyOrders.price" />
					</th>
				</tr>
			</thead>

			<tbody>
				{rows.map(
					({
						baseQuantity,
						orderId,
						price,
						quoteQuantity,
						side,
						symbol,
						time
					}) => (
						<tr key={orderId}>
							<td>{time}</td>

							<td>{side}</td>

							<td>{symbol}</td>

							<td>{baseQuantity}</td>

							<td>{quoteQuantity}</td>

							<td>{price}</td>
						</tr>
					)
				)}
			</tbody>
		</Table>
	)
}
