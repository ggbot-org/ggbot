import {
	Box,
	Button,
	ButtonOnClick,
	Buttons,
	Level,
	LevelItem
} from "@ggbot2/design"
import { StrategyScheduling } from "@ggbot2/models"
import { FC, useCallback } from "react"
import { FormattedMessage, useIntl } from "react-intl"

import { FrequencyInput, FrequencyInputProps } from "./FrequencyInput.js"
import { SchedulingStatus } from "./SchedulingStatus.js"

export type SchedulingItemProps = Pick<FrequencyInputProps, "setFrequency"> & {
	scheduling: Omit<StrategyScheduling, "frequency"> &
		Pick<FrequencyInputProps, "frequency">
	setStatus: (
		arg: Extract<StrategyScheduling["status"], "active" | "inactive">
	) => void
	removeScheduling: () => void
}

export const SchedulingItem: FC<SchedulingItemProps> = ({
	scheduling,
	setFrequency,
	removeScheduling,
	setStatus
}) => {
	const { formatMessage } = useIntl()

	const { frequency, status } = scheduling

	const onClickStatusButton = useCallback<ButtonOnClick>(() => {
		if (status !== "active") {
			setStatus("active")
		} else {
			setStatus("inactive")
		}
	}, [status, setStatus])

	const statusButtonLabel =
		status === "active"
			? formatMessage({ id: "SchedulingItem.dismiss" })
			: formatMessage({ id: "SchedulingItem.activate" })

	return (
		<Box>
			<Level
				left={
					<LevelItem>
						<Buttons size="small">
							<Button onClick={removeScheduling}>
								<FormattedMessage id="SchedulingItem.remove" />
							</Button>

							<Button onClick={onClickStatusButton}>
								{statusButtonLabel}
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

			<FrequencyInput frequency={frequency} setFrequency={setFrequency} />
		</Box>
	)
}
