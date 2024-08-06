import { useReadStrategies } from "_/hooks/user/api"
import { sessionWebStorage } from "_/storages/session"
import { AccountStrategy } from "@workspace/models"
import { useCallback, useEffect, useState } from "react"

export function useAccountStrategies() {
	const { canRun, data, isPending, request, reset } = useReadStrategies()

	const [accountStrategies, setAccountStrategies] = useState<AccountStrategy[] | undefined>(
		sessionWebStorage.accountStrategies.get()
	)

	const resetAccountStrategiesCache = useCallback(() => {
		sessionWebStorage.accountStrategies.delete()
	}, [])

	const resetAccountStrategies = useCallback(() => {
		resetAccountStrategiesCache()
		reset()
	}, [reset, resetAccountStrategiesCache])

	// Fetch account strategies if not found in web storage.
	useEffect(() => {
		if (accountStrategies) return
		if (canRun) request()
	}, [canRun, request, accountStrategies])

	// Store account strategies in web storage.
	useEffect(() => {
		if (!data) return
		sessionWebStorage.accountStrategies.set(data)
		setAccountStrategies(data)
	}, [data])

	// Handle case when account strategies changes or is deleted from localWebStorage in other tabs.
	const onLocalStorageChange = useCallback(() => {
		setAccountStrategies(sessionWebStorage.accountStrategies.get())
	}, [])
	useEffect(() => {
		addEventListener("storage", onLocalStorageChange)
		return () => removeEventListener("storage", onLocalStorageChange)
	}, [onLocalStorageChange])

	return {
		accountStrategies,
		readStrategiesIsPending: isPending,
		resetAccountStrategies,
		resetAccountStrategiesCache
	}
}
