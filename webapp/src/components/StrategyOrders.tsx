import { Message, Table } from "_/components/library"
import { Order } from "@workspace/models"
import { isMaybeObject } from "minimal-type-guard-helpers"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

type Row = {
	orderId: number
	side: string
	symbol: string
	time: string
	baseQuantity: string
	quoteQuantity: string
}

type Props = {
	orders: Order[] | undefined
}

export const StrategyOrders: FC<Props> = ({ orders }) => {
	const rows: Row[] = []
	if (Array.isArray(orders))
		for (const order of orders) {
			const { info } = order
			if (
				!isMaybeObject<{
					side: string
					orderId: number
					cummulativeQuoteQty: string
					executedQty: string
					transactTime: number
					symbol: string
				}>(info)
			)
				continue
			const {
				side,
				orderId,
				cummulativeQuoteQty,
				executedQty,
				transactTime,
				symbol
			} = info
			if (
				typeof cummulativeQuoteQty !== "string" ||
				typeof orderId !== "number" ||
				typeof symbol !== "string" ||
				typeof executedQty !== "string" ||
				typeof transactTime !== "number" ||
				typeof side !== "string"
			)
				continue
			rows.push({
				side,
				orderId,
				symbol,
				time: new Date(transactTime).toJSON(),
				baseQuantity: executedQty,
				quoteQuantity: cummulativeQuoteQty
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
				</tr>
			</thead>

			<tbody>
				{rows.map(
					({
						orderId,
						side,
						symbol,
						time,
						baseQuantity,
						quoteQuantity
					}) => (
						<tr key={orderId}>
							<td>{time}</td>

							<td>{side}</td>

							<td>{symbol}</td>

							<td>{baseQuantity}</td>

							<td>{quoteQuantity}</td>
						</tr>
					)
				)}
			</tbody>
		</Table>
	)
}
