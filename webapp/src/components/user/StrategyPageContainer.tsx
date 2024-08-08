import { Column, Columns, Content, Message } from "_/components/library"
import { StrategyId, StrategyKind } from "_/components/readonlyFields"
import { StrategyKey } from "@workspace/models"
import { PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"

function InvalidStrategyKey() {
	return (
		<Message color="info">
			<FormattedMessage id="InvalidStrategyKey.message" />
		</Message>
	)
}

function StrategyNotFound({ strategyId, strategyKind }: StrategyKey) {
	return (
		<Message
			color="warning"
			header={<FormattedMessage id="StrategyNotFound.title" />}
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

export function StrategyPageContainer({
	strategyKey, strategyNotFound, children
}: PropsWithChildren<{
	strategyKey: StrategyKey | undefined
	strategyNotFound: boolean
}>) {
	if (!strategyKey) return <InvalidStrategyKey />

	if (strategyNotFound) return <StrategyNotFound {...strategyKey} />

	return children
}
