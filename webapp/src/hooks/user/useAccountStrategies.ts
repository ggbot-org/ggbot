import { useReadStrategies } from "_/hooks/user/api"
import { sessionWebStorage } from "_/storages/session"
import { AccountStrategy } from "@workspace/models"
import { useCallback, useEffect, useState } from "react"

export function useAccountStrategies() {
	const { canRun, data, isPending, request, reset } = useReadStrategies()

	const [accountStrategies, setAccountStrategies] = useState<AccountStrategy[] | undefined>(
		sessionWebStorage.accountStrategies.get()
	)

	const resetAccountStrategies = useCallback(() => {
		reset()
	}, [reset])

	// Fetch account strategies.
	useEffect(() => {
		if (accountStrategies) return
		if (canRun) request()
	}, [canRun, request, accountStrategies])

	// Store account strategies.
	useEffect(() => {
		if (!data) return
		setAccountStrategies(data)
	}, [data])

	// Handle case when account strategies list changes
	// or is deleted from localWebStorage in other tabs.
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
	}
}
