import { Box, Title } from "_/components/library"
import { useBinanceSymbols } from "_/hooks/useBinanceSymbols"
import { DflowCommonContext, DflowCommonParameter, DflowBinanceParameter, extractCommonParameters, extractBinanceParameters } from "@workspace/dflow"
import { FC, useEffect } from "react"
import { FormattedMessage } from "react-intl"

import {
	SchedulingParameterItem,
	SchedulingParameterItemProps
} from "./SchedulingParameterItem"
import {FlowViewSerializableGraph} from "flow-view"
import {StrategyKind} from "@workspace/models"

type Props = {
flowViewGraph: FlowViewSerializableGraph| undefined
params: DflowCommonContext["params"] | undefined
strategyKind: StrategyKind
}

export const SchedulingParameters: FC<Props> = ({ flowViewGraph, params }) => {
console.log('flowViewGraph',flowViewGraph)
	const binanceSymbols = useBinanceSymbols()
	const items: SchedulingParameterItemProps[] = []

let commonParams: Array<DflowCommonParameter> = []
let binanceParams: Array<DflowBinanceParameter> = []
if (flowViewGraph ) {
commonParams = extractCommonParameters(flowViewGraph)
if (binanceSymbols)
binanceParams = extractBinanceParameters(binanceSymbols, flowViewGraph)
}
console.log(commonParams, binanceParams)

	if (params)
		for (const [key, value] of Object.entries(params))
			items.push({ name: key, value })

useEffect(() => {
if (flowViewGraph &&binanceSymbols)
console.log(
'binanceParams', extractBinanceParameters(binanceSymbols,flowViewGraph)
)
}, [flowViewGraph, binanceSymbols])

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
