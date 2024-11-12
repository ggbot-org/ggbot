import { Button } from '_/components/library'
import { useEnterAsAccount } from '_/hooks/admin/api'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { localWebStorage } from '_/storages/local'
import { AccountKey } from '@workspace/models'
import { useEffect } from 'react'

export function EnterAsAccount ({ accountId }: { accountId?: AccountKey['accountId'] }) {
	const { data, request, isPending } = useEnterAsAccount()

	useEffect(() => {
		if (!data?.token) return
		localWebStorage.authToken.set(data.token)
		GOTO(webapp.user.dashboard)
	}, [data])

	if (!accountId) return null

	return (
		<Button
			isLoading={isPending}
			onClick={() => request({ accountId })}
		>
			Enter as Account
		</Button>
	)
}
