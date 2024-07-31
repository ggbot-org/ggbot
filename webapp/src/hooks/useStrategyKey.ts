import { strategyKeyParamsFromURL } from "_/routing/paramFromURL"
import { useMemo } from "react"

export function useStrategyKey() {
	return useMemo(() => {
		const url = new URL(location.href)
		return strategyKeyParamsFromURL(url)
	}, [])
}
