import { Column, Columns, Content, Message } from "_/components/library"
import { StrategyId } from "_/components/StrategyId"
import { StrategyKind } from "_/components/StrategyKind"
import { StrategyKey } from "@workspace/models"
import { useIntl } from "react-intl"

type Props = StrategyKey

export function StrategyNotFound({ strategyId, strategyKind }: Props) {
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
