import { Column, Columns } from "_/components/library"
import { ProfitSummary } from "_/components/ProfitSummary"
import { StrategyOrders } from "_/components/StrategyOrders"
import { Order, StrategyKind } from "@workspace/models"
import { DayInterval } from "minimal-time-helpers"
import { FC } from "react"

type Props = {
	dayInterval: DayInterval | undefined
	orders: Order[] | undefined
	strategyKind: StrategyKind | undefined
}

export const StrategyProfits: FC<Props> = ({
	dayInterval,
	orders,
	strategyKind
}) => (
		<>
			<Columns>
				<Column size={{ desktop: "two-thirds" }}>
					<ProfitSummary
						orders={orders}
						dayInterval={dayInterval}
						strategyKind={strategyKind}
					/>
				</Column>
			</Columns>

			<Columns>
				<Column>
					<StrategyOrders orders={orders} />
				</Column>
			</Columns>
		</>
	)
