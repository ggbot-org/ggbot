import { usePublicApi } from "_/hooks/usePublicApi"
import { StrategyKey } from "@workspace/models"
import { FlowViewSerializableGraph } from "flow-view"
import { useEffect } from "react"

export type UseStrategyFlowOutput = FlowViewSerializableGraph | null | undefined

export const useStrategyFlow = (
	strategyKey: StrategyKey | undefined
): UseStrategyFlowOutput => {
	const { data, canRun, request } = usePublicApi.ReadStrategyFlow()

	// Fetch flow.
	useEffect(() => {
		if (!strategyKey) return
		if (canRun) request(strategyKey)
	}, [canRun, request, strategyKey])

	if (!strategyKey) return undefined
	if (!data) return null
	return data.view
}
