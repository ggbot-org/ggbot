import { Button, Buttons, Div, OneColumn, Title } from '_/components/library'
import { GoCopyStrategy, ShareStrategy } from '_/components/public/StrategyActions'
import { StrategyRecord, StrategyRecordProps } from '_/components/StrategyRecord'
import { DeleteStrategy } from '_/components/user/DeleteStrategy'
import { RenameStrategy } from '_/components/user/RenameStrategy'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { sessionWebStorage } from '_/storages/session'
import { Strategy, StrategyKey } from '@workspace/models'
import { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'

function GoEditStrategy({ strategyKey }: { strategyKey: StrategyKey | undefined }) {
	return strategyKey ? (
		<Button onClick={() => GOTO(webapp.user.editStrategy(strategyKey))}>
			<FormattedMessage id="GoEditStrategy.label" />
		</Button>
	) : null
}

export function StrategyActions({
	strategy, strategyKey, strategyId, strategyName: _strategyName, strategyWhenCreated, readStrategyIsPending
}: StrategyRecordProps & {
	strategy: Strategy | null | undefined
	strategyKey: StrategyKey | undefined
	readStrategyIsPending: boolean | undefined
}) {
	const [strategyName, setStrategyName] = useState(_strategyName)

	const renameStrategy = useCallback((name: string) => {
		if (!strategy || !strategyKey) return
		const updatedStrategy = { ...strategy, name }
		sessionWebStorage.strategy(strategyKey).set(updatedStrategy)
		setStrategyName(name)
	}, [strategy, strategyKey])

	return (
		<OneColumn>
			<Div bulma={['box', { 'is-skeleton': readStrategyIsPending }]}>
				<Title>
					<FormattedMessage id="StrategyActions.title" />
				</Title>
				<StrategyRecord strategyId={strategyId} strategyName={strategyName} strategyWhenCreated={strategyWhenCreated} />
				<Buttons>
					<RenameStrategy renameStrategy={renameStrategy} strategyKey={strategyKey} strategyName={strategyName} />
					<GoCopyStrategy strategyKey={strategyKey} />
					<ShareStrategy strategyKey={strategyKey} strategyName={strategyName} />
					<GoEditStrategy strategyKey={strategyKey} />
					<DeleteStrategy strategyId={strategyId} strategyKey={strategyKey} strategyName={strategyName} strategyWhenCreated={strategyWhenCreated} />
				</Buttons>
			</Div>
		</OneColumn>
	)
}
