import { Button, ButtonProps, Buttons } from "_/components/library"
import type { UseBacktestingOutput } from "_/hooks/useBacktesting"
import { FC } from "react"
import { useIntl } from "react-intl"

const PauseButton: FC<ButtonProps> = (props) => {
	const { formatMessage } = useIntl()
	return (
		<Button {...props}>
			{formatMessage({ id: "BacktestingActions.pause" })}
		</Button>
	)
}

const ResumeButton: FC<ButtonProps> = (props) => {
	const { formatMessage } = useIntl()
	return (
		<Button color="primary" {...props}>
			{formatMessage({ id: "BacktestingActions.resume" })}
		</Button>
	)
}

const StartButton: FC<ButtonProps> = (props) => {
	const { formatMessage } = useIntl()
	return (
		<Button color="primary" {...props}>
			{formatMessage({ id: "BacktestingActions.start" })}
		</Button>
	)
}

const StopButton: FC<ButtonProps> = (props) => {
	const { formatMessage } = useIntl()
	return (
		<Button {...props}>
			{formatMessage({ id: "BacktestingActions.stop" })}
		</Button>
	)
}

type Props = Pick<UseBacktestingOutput["state"], "isPaused" | "isRunning"> & {
	canStart: boolean
	onClickPause: ButtonProps["onClick"]
	onClickResume: ButtonProps["onClick"]
	onClickStart: ButtonProps["onClick"]
	onClickStop: ButtonProps["onClick"]
}

export const BacktestingActions: FC<Props> = ({
	canStart,
	isPaused,
	isRunning,
	onClickPause,
	onClickResume,
	onClickStart,
	onClickStop
}) => {
	if (isPaused)
		return (
			<Buttons>
				<ResumeButton onClick={onClickResume} />

				<StopButton onClick={onClickStop} />
			</Buttons>
		)

	if (isRunning)
		return (
			<Buttons>
				<PauseButton onClick={onClickPause} />

				<StopButton onClick={onClickStop} />
			</Buttons>
		)

	return <StartButton onClick={onClickStart} disabled={!canStart} />
}
