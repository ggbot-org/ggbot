import { Message, Table } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { useUserApi } from "_/hooks/useUserApi"
import { getDay, today } from "minimal-time-helpers"
import { isMaybeObject } from "minimal-type-guard-helpers"
import { FC, useContext, useEffect } from "react"
import { FormattedMessage } from "react-intl"

const numDays = 30

type Row = {
	orderId: number
	side: string
	symbol: string
	time: string
	baseQuantity: string
	quoteQuantity: string
}

export const StrategyOrders: FC = () => {
	const { strategyKey } = useContext(StrategyContext)

	const end = today()
	const start = getDay(end).minus(numDays).days

	const READ = useUserApi.ReadStrategyOrders()

	const orders = READ.data ?? []

	const rows: Row[] = []
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

	useEffect(() => {
		if (!strategyKey) return
		if (READ.canRun)
			READ.request({
				end,
				start,
				...strategyKey
			})
	}, [READ, end, start, strategyKey])

	if (!READ.isDone) return null

	if (READ.isDone && orders.length === 0)
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
