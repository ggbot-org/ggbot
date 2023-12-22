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
		<Button {...props}>
			{formatMessage({ id: "BacktestingActions.resume" })}
		</Button>
	)
}

const StartButton: FC<ButtonProps> = (props) => {
	const { formatMessage } = useIntl()
	return (
		<Button {...props}>
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
	onClickPause: ButtonProps["onClick"]
	onClickResume: ButtonProps["onClick"]
	onClickStart: ButtonProps["onClick"]
	onClickStop: ButtonProps["onClick"]
}

export const BacktestingActions: FC<Props> = ({
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
				<StopButton onClick={onClickStop} />

				<ResumeButton onClick={onClickResume} />
			</Buttons>
		)

	if (isRunning)
		return (
			<Buttons>
				<StopButton onClick={onClickStop} />

				<PauseButton onClick={onClickPause} />
			</Buttons>
		)

	return <StartButton onClick={onClickStart} />
}
