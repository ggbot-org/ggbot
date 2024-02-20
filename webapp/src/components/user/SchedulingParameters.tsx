import { Box, Title } from "_/components/library"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import {
	DflowCommonContext,
	extractBinanceParameters,
	extractCommonParameters
} from "@workspace/dflow"
import { FlowViewSerializableGraph } from "flow-view"
import { FC, useMemo } from "react"
import { FormattedMessage } from "react-intl"

import {
	SchedulingParameterItem,
	SchedulingParameterItemProps
} from "./SchedulingParameterItem"

type Props = {
	flowViewGraph: FlowViewSerializableGraph | undefined
	params: DflowCommonContext["params"] | undefined
}

export const SchedulingParameters: FC<Props> = ({
	flowViewGraph,
	params = {}
}) => {
	const binanceSymbols = useBinanceSymbols()

	const items = useMemo<SchedulingParameterItemProps[]>(() => {
		const items: SchedulingParameterItemProps[] = []
		if (!flowViewGraph) return []

		const commonParams = extractCommonParameters(flowViewGraph)

		for (const { key, defaultValue } of commonParams) {
			const value = params[key]
			items.push({
				label: key,
				defaultValue,
				value
			})
		}

		const binanceParams = binanceSymbols
			? extractBinanceParameters(binanceSymbols, flowViewGraph)
			: []

		for (const { key, defaultValue } of binanceParams) {
			const value = params[key]
			items.push({
				label: key,
				defaultValue,
				value
			})
		}
		return items
	}, [flowViewGraph, binanceSymbols, params])

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
				{items.map(({ defaultValue, label, value }) => (
					<SchedulingParameterItem
						key={label}
						defaultValue={defaultValue}
						label={label}
						value={value}
					/>
				))}
			</div>
		</Box>
	)
}
