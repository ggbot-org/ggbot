import { Button, ButtonProps, Buttons } from "_/components/library"
import type { UseBacktestingState } from "_/hooks/useBacktesting"
import { useIntl } from "react-intl"

function PauseButton(props: ButtonProps) {
	const { formatMessage } = useIntl()
	return (
		<Button {...props}>
			{formatMessage({ id: "BacktestingActions.pause" })}
		</Button>
	)
}

function ResumeButton(props: ButtonProps) {
	const { formatMessage } = useIntl()
	return (
		<Button color="primary" {...props}>
			{formatMessage({ id: "BacktestingActions.resume" })}
		</Button>
	)
}

function StartButton(props: ButtonProps) {
	const { formatMessage } = useIntl()
	return (
		<Button color="primary" {...props}>
			{formatMessage({ id: "BacktestingActions.start" })}
		</Button>
	)
}

function StopButton(props: ButtonProps) {
	const { formatMessage } = useIntl()
	return (
		<Button {...props}>
			{formatMessage({ id: "BacktestingActions.stop" })}
		</Button>
	)
}

export function BacktestingActions({
	canStart,
	isPaused,
	isRunning,
	onClickPause,
	onClickResume,
	onClickStart,
	onClickStop
}: Pick<UseBacktestingState, "isPaused" | "isRunning"> & {
	canStart: boolean
	onClickPause: ButtonProps["onClick"]
	onClickResume: ButtonProps["onClick"]
	onClickStart: ButtonProps["onClick"]
	onClickStop: ButtonProps["onClick"]
}) {
	if (isPaused) return (
		<Buttons>
			<ResumeButton onClick={onClickResume} />
			<StopButton onClick={onClickStop} />
		</Buttons>
	)

	if (isRunning) return (
		<Buttons>
			<PauseButton onClick={onClickPause} />
			<StopButton onClick={onClickStop} />
		</Buttons>
	)

	return <StartButton disabled={!canStart} onClick={onClickStart} />
}
