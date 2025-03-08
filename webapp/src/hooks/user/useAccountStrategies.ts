import { useReadStrategies } from '_/hooks/user/api'
import { AccountStrategy } from '@workspace/models'
import { useEffect, useState } from 'react'

export function useAccountStrategies() {
	const { canRun, data, isPending, request } = useReadStrategies()

	const [accountStrategies, setAccountStrategies] = useState<
		AccountStrategy[] | undefined
	>()

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
	}
}
