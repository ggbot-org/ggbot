import { Control, Field } from "@ggbot2/design"
import { AccountStrategy } from "@ggbot2/models"
import { FC } from "react"

import { SchedulingStatus } from "./SchedulingStatus.js"

type Props = {
	schedulings: AccountStrategy["schedulings"]
}

export const SchedulingsStatusBadges: FC<Props> = ({ schedulings }) => {
	let numActive = 0
	let numInactive = 0
	let numSuspended = 0

	for (const { status } of schedulings) {
		if (status === "active") numActive++
		if (status === "inactive") numInactive++
		if (status === "suspended") numSuspended++
	}

	if (schedulings.length === 0) return <SchedulingStatus status="inactive" />

	if (schedulings.length === 1)
		return <SchedulingStatus status={schedulings[0].status} />

	return (
		<Field isGrouped="multiline">
			<Control>
				<SchedulingStatus status="suspended" count={numSuspended} />
			</Control>

			<Control>
				<SchedulingStatus status="inactive" count={numInactive} />
			</Control>

			<Control>
				<SchedulingStatus status="active" count={numActive} />
			</Control>
		</Field>
	)
}