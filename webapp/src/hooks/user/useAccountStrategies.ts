import { useReadStrategies } from '_/hooks/user/api'
import { AccountStrategy } from '@workspace/models'
import { useCallback, useEffect, useState } from 'react'

export function useAccountStrategies() {
	const { canRun, data, isPending, request, reset } = useReadStrategies()

	const [accountStrategies, setAccountStrategies] = useState<
		AccountStrategy[] | undefined
	>()

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

	return {
		accountStrategies,
		readStrategiesIsPending: isPending,
		resetAccountStrategies,
	}
}
