import { Box, Title } from "_/components/library"
import { DflowCommonContext } from "@workspace/dflow"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import {
	SchedulingParameterItem,
	SchedulingParameterItemProps
} from "./SchedulingParameterItem"

type Props = { params: DflowCommonContext["params"] | undefined }

export const SchedulingParameters: FC<Props> = ({ params }) => {
	const items: SchedulingParameterItemProps[] = []

	if (params)
		for (const [key, value] of Object.entries(params))
			items.push({ name: key, value })

	return (
		<Box>
			<Title>
				<FormattedMessage id="Parameters.title" />
			</Title>

			{items.length === 0 && (
				<span>
					<FormattedMessage id="Parameters.empty" />
				</span>
			)}

			<div>
				{items.map(({ name, value }) => (
					<SchedulingParameterItem
						key={name}
						name={name}
						value={value}
					/>
				))}
			</div>
		</Box>
	)
}
