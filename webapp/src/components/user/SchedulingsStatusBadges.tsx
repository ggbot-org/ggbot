import { Control, Field } from "_/components/library"
import { SchedulingStatus } from "_/components/user/SchedulingStatus"
import {
	AccountStrategy,
	getSchedulingSummary,
	schedulingsAreInactive,
	schedulingStatuses
} from "@workspace/models"
import { FC } from "react"

type Props = {
	schedulings: AccountStrategy["schedulings"]
}

export const SchedulingsStatusBadges: FC<Props> = ({ schedulings }) => {
	const schedulingSummary = getSchedulingSummary(schedulings)

	if (schedulingsAreInactive(schedulings))
		return <SchedulingStatus status="inactive" />

	if (schedulings.length === 1)
		return <SchedulingStatus status={schedulings[0].status} />

	return (
		<Field isGrouped="multiline">
			{schedulingStatuses.map((schedulingStatus) => (
				<Control key={schedulingStatus}>
					<SchedulingStatus
						status={schedulingStatus}
						count={schedulingSummary[schedulingStatus]}
					/>
				</Control>
			))}
		</Field>
	)
}
