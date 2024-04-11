import { Box, Title } from "_/components/library"
import {
	SchedulingParameterItem,
	SchedulingParameterItemProps
} from "_/components/user/SchedulingParameterItem"
import { UseStrategyFlowOutput } from "_/hooks/useStrategyFlow"
import {
	extractBinanceParameters,
	extractCommonParameters
} from "@workspace/dflow"
import { DflowBinanceSymbolInfo } from "@workspace/dflow"
import { StrategyParameters } from "@workspace/models"
import { FC, useMemo } from "react"
import { FormattedMessage } from "react-intl"

export type SchedulingParametersProps = Pick<
	SchedulingParameterItemProps,
	"setParam"
> & {
	binanceSymbols: DflowBinanceSymbolInfo[] | undefined
	flowViewGraph: UseStrategyFlowOutput
	params: StrategyParameters | undefined
}

export const SchedulingParameters: FC<SchedulingParametersProps> = ({
	binanceSymbols,
	flowViewGraph,
	setParam,
	params
}) => {
	const schedulingParameterItems = useMemo<
		Array<
			Pick<
				SchedulingParameterItemProps,
				"kind" | "label" | "value" | "defaultValue"
			>
		>
	>(() => {
		const items = []
		if (!flowViewGraph) return []
		if (!params) return []

		const commonParams = extractCommonParameters(flowViewGraph)

		for (const { key, kind, defaultValue } of commonParams) {
			const value = params[key]
			items.push({
				kind,
				label: key,
				defaultValue,
				value
			})
		}

		const binanceParams = binanceSymbols
			? extractBinanceParameters(binanceSymbols, flowViewGraph)
			: []

		for (const { key, kind, defaultValue } of binanceParams) {
			const value = params[key]
			items.push({
				kind,
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
				<FormattedMessage id="SchedulingParameters.title" />
			</Title>

			{schedulingParameterItems.length === 0 && (
				<span>
					<FormattedMessage id="SchedulingParameters.empty" />
				</span>
			)}

			<div>
				{schedulingParameterItems.map(
					({ kind, defaultValue, label, value }) => (
						<SchedulingParameterItem
							key={label}
							kind={kind}
							binanceSymbols={binanceSymbols}
							setParam={setParam}
							defaultValue={defaultValue}
							label={label}
							value={value}
						/>
					)
				)}
			</div>
		</Box>
	)
}
