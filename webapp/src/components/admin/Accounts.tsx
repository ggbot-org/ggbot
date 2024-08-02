import { Column, Columns, Div } from "_/components/library"
import { AccountId } from "_/components/readonlyFields"
import { useListAccountKeys } from "_/hooks/admin/api"
import { webapp } from "_/routing/webapp"
import { AccountKey, isAccountKey } from "@workspace/models"
import { useEffect } from "react"

type AccountItem = AccountKey & {
	href: string
}

export function Accounts() {
	const READ = useListAccountKeys()
	const { data } = READ

	const accountItems: AccountItem[] = []

	if (Array.isArray(data)) {
		for (const item of data) if (isAccountKey(item)) accountItems.push({
			...item,
			href: webapp.admin.accountDetails(item).pathname
		})
	}

	useEffect(() => {
		// TODO ListAccountKeys input should be optional ContinuationToken to implement pagination
		// for now I am forced to pass undefined
		if (READ.canRun) READ.request(undefined)
	}, [READ])

	return (
		<Columns isMultiline>
			{accountItems.map(({ accountId, href }) => (
				<Column
					key={accountId}
					bulma={["is-half-tablet", "is-one-third-desktop"]}
				>
					<a href={href} tabIndex={0}>
						<Div bulma="box">
							<AccountId value={accountId} />
						</Div>
					</a>
				</Column>
			))}
		</Columns>
	)
}
