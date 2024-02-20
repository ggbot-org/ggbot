import { Box, Title } from "_/components/library"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import {
	SchedulingParameterItem,
	SchedulingParameterItemProps
} from "./SchedulingParameterItem"

type Props = Pick<SchedulingParameterItemProps, "setParam"> & {
	items: Array<
		Pick<SchedulingParameterItemProps, "label" | "value" | "defaultValue">
	>
}

export const SchedulingParameters: FC<Props> = ({ items, setParam }) => (
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
			{items.map(({ defaultValue, label, value }) => (
				<SchedulingParameterItem
					key={label}
					setParam={setParam}
					defaultValue={defaultValue}
					label={label}
					value={value}
				/>
			))}
		</div>
	</Box>
)
