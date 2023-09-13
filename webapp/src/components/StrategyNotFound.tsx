import { Column, Columns, Content, Message } from "_/components/library"
import { StrategyId } from "_/components/StrategyId"
import { StrategyKind } from "_/components/StrategyKind"
import { StrategyKey } from "@workspace/models"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = StrategyKey

export const StrategyNotFound: FC<Props> = ({ strategyId, strategyKind }) => {
	const { formatMessage } = useIntl()

	return (
		<Message
			color="warning"
			header={formatMessage({ id: "StrategyNotFound.title" })}
		>
			<Content>
				<Columns>
					<Column>
						<StrategyKind value={strategyKind} />
					</Column>

					<Column>
						<StrategyId value={strategyId} />
					</Column>
				</Columns>
			</Content>
		</Message>
	)
}
