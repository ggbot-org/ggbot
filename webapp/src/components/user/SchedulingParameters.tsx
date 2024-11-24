import { Div, Title } from '_/components/library'
import { SchedulingParameterItem, SchedulingParameterItemProps } from '_/components/user/SchedulingParameterItem'
import { useBinanceSymbols } from '_/hooks/useBinanceSymbols'
import { useStrategyKey } from '_/hooks/useStrategyKey'
import { FormattedMessage } from '_/i18n/components'
import { extractBinanceParametersFromFlow, extractCommonParametersFromFlow } from '@workspace/dflow'
import { StrategyFlow, StrategyParameters } from '@workspace/models'
import { useEffect, useState } from 'react'

export function SchedulingParameters({
	flowViewGraph, setParam, params
}: Pick<SchedulingParameterItemProps, 'setParam'> & {
	flowViewGraph: StrategyFlow['view'] | undefined
	params: StrategyParameters | undefined
}) {
	const { strategyKind } = useStrategyKey()
	const binanceSymbols = useBinanceSymbols(strategyKind)

	const [schedulingParameterItems, setSchedulingParameterItems] = useState<
		Array<Pick<SchedulingParameterItemProps, 'kind' | 'label' | 'paramValue' | 'defaultParamValue'>>
	>([])

	useEffect(() => {
		(async () => {
			const items = []
			if (!flowViewGraph) return

			const commonParams = await extractCommonParametersFromFlow(flowViewGraph)

			for (const { key, kind, defaultValue } of commonParams) items.push({
				kind,
				label: key,
				defaultParamValue: defaultValue,
				paramValue: params?.[key]
			})

			const binanceParams = binanceSymbols
				? await extractBinanceParametersFromFlow(binanceSymbols, flowViewGraph)
				: []

			for (const { key, kind, defaultValue } of binanceParams) items.push({
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
						label={label}
						setParam={setParam}
						{...rest}
					/>
				))}
			</div>
		</Div>
	)
}
