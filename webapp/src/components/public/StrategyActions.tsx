import { Button, Buttons, Div, OneColumn, Title } from '_/components/library'
import {
	StrategyRecord,
	StrategyRecordProps,
} from '_/components/StrategyRecord'
import { ToastContext } from '_/contexts/Toast'
import { FormattedMessage } from '_/i18n/components'
import { useIntl } from '_/i18n/hooks'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { Strategy, StrategyKey } from '@workspace/models'
import { useContext } from 'react'

export function GoCopyStrategy({
	strategyKey,
}: {
	strategyKey: StrategyKey | undefined
}) {
	return strategyKey ? (
		<Button onClick={() => GOTO(webapp.user.copyStrategy(strategyKey))}>
			<FormattedMessage id="GoCopyStrategy.label" />
		</Button>
	) : null
}

export function ShareStrategy({
	strategyKey,
	strategyName,
}: Partial<{
	strategyKey: StrategyKey
	strategyName: Strategy['name']
}>) {
	const { formatMessage } = useIntl()
	const { toast } = useContext(ToastContext)
	return (
		<Button
			onClick={() => {
				try {
					const shareData:
						| Pick<ShareData, 'title' | 'text' | 'url'>
						| undefined = strategyKey
						? {
								title: PROJECT_SHORT_NAME,
								url: webapp.strategy(strategyKey).href,
								text: strategyName,
							}
						: undefined
					if (!shareData) return
					if (
						// Use native share API if available, only on mobile.
						'share' in navigator &&
						navigator.canShare?.(shareData) &&
						(navigator.userAgent.match(/Android/i) ||
							navigator.userAgent.match(/iPhone/i))
					) {
						navigator.share(shareData)
					} else if ('clipboard' in navigator && shareData.url) {
						navigator.clipboard
							.writeText(shareData.url)
							.then(() =>
								toast.info(formatMessage({ id: 'ShareStrategy.copied' }))
							)
					} else throw new Error(`Cannot share ${shareData}`)
				} catch (error) {
					console.error(error)
					toast.warning(formatMessage({ id: 'ShareStrategy.error' }))
				}
			}}
		>
			{formatMessage({ id: 'ShareStrategy.label' })}
		</Button>
	)
}
export function StrategyActions({
	readStrategyIsPending,
	strategyKey,
	strategyName,
	strategyId,
	strategyWhenCreated,
}: StrategyRecordProps & {
	readStrategyIsPending: boolean | undefined
	strategyKey: StrategyKey | undefined
}) {
	return (
		<OneColumn>
			<Div bulma={['box', { 'is-skeleton': readStrategyIsPending }]}>
				<Title>
					<FormattedMessage id="StrategyActions.title" />
				</Title>
				<StrategyRecord
					strategyId={strategyId}
					strategyName={strategyName}
					strategyWhenCreated={strategyWhenCreated}
				/>
				<Buttons>
					<GoCopyStrategy strategyKey={strategyKey} />
					<ShareStrategy
						strategyKey={strategyKey}
						strategyName={strategyName}
					/>
				</Buttons>
			</Div>
		</OneColumn>
	)
}
