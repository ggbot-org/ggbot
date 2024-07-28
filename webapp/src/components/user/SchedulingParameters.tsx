import { Div, Title } from "_/components/library"
import {
	SchedulingParameterItem,
	SchedulingParameterItemProps
} from "_/components/user/SchedulingParameterItem"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import { UseStrategyFlowOutput } from "_/hooks/useStrategyFlow"
import {
	extractBinanceParametersFromFlow,
	extractCommonParametersFromFlow
} from "@workspace/dflow"
import { StrategyParameters } from "@workspace/models"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

export type SchedulingParametersProps = Pick<
	SchedulingParameterItemProps,
	"setParam"
> & {
	flowViewGraph: UseStrategyFlowOutput
	params: StrategyParameters | undefined
}

export function SchedulingParameters({
	flowViewGraph,
	setParam,
	params
}: SchedulingParametersProps) {
	const binanceSymbols = useBinanceSymbols()

	const [schedulingParameterItems, setSchedulingParameterItems] = useState<
		Array<
			Pick<
				SchedulingParameterItemProps,
				"kind" | "label" | "paramValue" | "defaultParamValue"
			>
		>
	>([])

	useEffect(() => {
		;(async () => {
			const items = []
			if (!flowViewGraph) return

			const commonParams =
				await extractCommonParametersFromFlow(flowViewGraph)

			for (const { key, kind, defaultValue } of commonParams)
				items.push({
					kind,
					label: key,
					defaultParamValue: defaultValue,
					paramValue: params?.[key]
				})

			const binanceParams = binanceSymbols
				? await extractBinanceParametersFromFlow(
						binanceSymbols,
						flowViewGraph
					)
				: []

			for (const { key, kind, defaultValue } of binanceParams)
				items.push({
					kind,
					label: key,
					defaultParamValue: defaultValue,
					paramValue: params?.[key]
				})

			setSchedulingParameterItems(items)
		})()
	}, [flowViewGraph, binanceSymbols, params])

	return (
		<Div bulma="box">
			<Title>
				<FormattedMessage id="SchedulingParameters.title" />
			</Title>

			{schedulingParameterItems.length === 0 && (
				<span>
					<FormattedMessage id="SchedulingParameters.empty" />
				</span>
			)}

			<div>
				{schedulingParameterItems.map(({ label, ...rest }) => (
					<SchedulingParameterItem
						key={label}
						binanceSymbols={binanceSymbols}
						setParam={setParam}
						label={label}
						{...rest}
					/>
				))}
			</div>
		</Div>
	)
}
