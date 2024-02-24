import { Box, Title } from "_/components/library"
import { DflowBinanceSymbolInfo } from "@workspace/dflow"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import {
	SchedulingParameterItem,
	SchedulingParameterItemProps
} from "./SchedulingParameterItem"

type Props = Pick<SchedulingParameterItemProps, "setParam"> & {
	binanceSymbols: DflowBinanceSymbolInfo[] | undefined
	items: Array<
		Pick<
			SchedulingParameterItemProps,
			"kind" | "label" | "value" | "defaultValue"
		>
	>
}

export const SchedulingParameters: FC<Props> = ({
	binanceSymbols,
	items,
	setParam
}) => (
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
			{items.map(({ kind, defaultValue, label, value }) => (
				<SchedulingParameterItem
					key={label}
					kind={kind}
					binanceSymbols={binanceSymbols}
					setParam={setParam}
					defaultValue={defaultValue}
					label={label}
					value={value}
				/>
			))}
		</div>
	</Box>
)
