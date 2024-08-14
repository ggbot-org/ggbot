import { classnames } from "_/classnames"
import { Column, Columns, Div } from "_/components/library"
import { AccountId } from "_/components/readonlyFields"
import { useListAccountKeys } from "_/hooks/admin/api"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { AccountKey, isAccountKey } from "@workspace/models"
import { useEffect } from "react"

function AccountItem ({ accountId, isLoading }: AccountKey & Partial<{ isLoading: boolean }>) {
	return (
		<Column>
			<Div
				bulma={classnames("box", { "is-clickable": !isLoading, "skeleton-block": isLoading })}
				onClick={() => GOTO(webapp.admin.accountDetails({ accountId }))}
			>
				<AccountId value={accountId} />
			</Div>
		</Column>
	)
}

export function Accounts() {
	const { data, canRun, request, isPending } = useListAccountKeys()

	const items: AccountKey[] = []

	if (data) for (const item of data.accountKeys) {
		if (isAccountKey(item)) items.push(item)
	}

	useEffect(() => {
		// TODO ListAccountKeys input should be optional ContinuationToken to implement pagination
		// for now I am forced to pass undefined
		if (canRun) request({ token: undefined, numItems: 100 })
	}, [canRun, request])

	if (isPending) return (
		<Columns isMultiline>
			<Column bulma={["is-half-tablet", "is-one-third-desktop"]} >
				<AccountItem accountId="" />
			</Column>
		</Columns>
	)

	return (
		<Columns isMultiline>
			{items.map(({ accountId }) => (
				<Column
					key={accountId}
					bulma={["is-half-tablet", "is-one-third-desktop"]}
				>
					<AccountItem accountId={accountId} />
				</Column>
			))}
		</Columns>
	)
}
