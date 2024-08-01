import { useReadAccount } from "_/hooks/admin/api"
import { AccountKey } from "@workspace/models"
import { useEffect } from "react"

export function useAccount(accountKey: AccountKey | undefined) {
	const { data, canRun, request } = useReadAccount()

	useEffect(() => {
		if (!accountKey) return
		if (canRun) request(accountKey)
	}, [canRun, request, accountKey])

	return {
		account: data
	}
}
