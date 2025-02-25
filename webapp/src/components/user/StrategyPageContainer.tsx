import {
	Column,
	Columns,
	Content,
	Message,
	OneColumn,
} from '_/components/library'
import { StrategyId, StrategyKind } from '_/components/readonlyFields'
import { FormattedMessage } from '_/i18n/components'
import { StrategyKey } from '@workspace/models'
import { PropsWithChildren } from 'react'

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
	strategyKey,
	strategyNotFound,
	children,
}: PropsWithChildren<{
	strategyKey: StrategyKey | undefined
	strategyNotFound: boolean | undefined
}>) {
	if (!strategyKey)
		return (
			<OneColumn>
				<InvalidStrategyKey />
			</OneColumn>
		)

	if (strategyNotFound)
		return (
			<OneColumn>
				<StrategyNotFound {...strategyKey} />
			</OneColumn>
		)

	if (strategyNotFound === undefined) return null

	return children
}
