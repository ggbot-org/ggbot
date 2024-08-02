import { Control, Field } from "_/components/library"
import { SchedulingStatus } from "_/components/user/SchedulingStatus"
import {
	AccountStrategy,
	getSchedulingSummary,
	schedulingsAreInactive,
	schedulingStatuses
} from "@workspace/models"

type Props = {
	schedulings: AccountStrategy["schedulings"] | undefined
}

export function SchedulingsStatusBadges({ schedulings }: Props) {
	if (!schedulings) return null

	const schedulingSummary = getSchedulingSummary(schedulings)

	if (schedulingsAreInactive(schedulings)) return <SchedulingStatus status="inactive" />

	if (schedulings.length === 1) return <SchedulingStatus status={schedulings[0].status} />

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
