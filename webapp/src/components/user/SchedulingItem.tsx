import { FrequencyInput,
	FrequencyInputProps } from '_/components/FrequencyInput'
import { Button, Buttons, Div, Level, LevelItem } from '_/components/library'
import { SchedulingStatus } from '_/components/user/SchedulingStatus'
import { StrategyScheduling } from '@workspace/models'
import { useCallback } from 'react'
import { FormattedMessage } from 'react-intl'

export type SchedulingItemProps = Pick<
	FrequencyInputProps,
	'disabledIntervalOptions' | 'setFrequency'
> & {
	scheduling: Omit<StrategyScheduling, 'frequency'> &
		Pick<FrequencyInputProps, 'frequency'>;
	setStatus: (
		arg: Extract<StrategyScheduling['status'], 'active' | 'inactive'>,
	) => void;
	removeScheduling: () => void;
}

export function SchedulingItem({
	disabledIntervalOptions,
	scheduling,
	setFrequency,
	removeScheduling,
	setStatus,
}: SchedulingItemProps) {
	const { frequency, status } = scheduling

	const onClickStatusButton = useCallback(() => {
		if (status !== 'active') setStatus('active')
		else setStatus('inactive')
	}, [status, setStatus])

	return (
		<Div bulma="box">
			<Level
				left={
					<LevelItem>
						<Buttons size="small">
							<Button isRounded onClick={removeScheduling}>
								<FormattedMessage id="SchedulingItem.remove" />
							</Button>
							<Button isRounded onClick={onClickStatusButton}>
								{status === 'active' ? (
									<FormattedMessage id="SchedulingItem.dismiss" />
								) : (
									<FormattedMessage id="SchedulingItem.activate" />
								)}
							</Button>
						</Buttons>
					</LevelItem>
				}
				right={
					<LevelItem>
						<SchedulingStatus status={scheduling.status} />
					</LevelItem>
				}
			/>
			<FrequencyInput
				disabledIntervalOptions={disabledIntervalOptions}
				frequency={frequency}
				setFrequency={setFrequency}
			/>
		</Div>
	)
}
