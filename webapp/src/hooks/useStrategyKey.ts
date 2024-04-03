import { strategyKeyParamsFromURL } from "_/routing/paramFromURL"
import { useMemo } from "react"

export const useStrategyKey = (url = new URL(location.href)) =>
	useMemo(() => strategyKeyParamsFromURL(url), [url])
