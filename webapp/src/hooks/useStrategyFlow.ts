import { usePublicApi } from "_/hooks/usePublicApi"
import { StrategyFlow, StrategyKey } from "@workspace/models"
import { useEffect } from "react"

export type UseStrategyFlowOutput = StrategyFlow["view"] | null | undefined

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
