import { AccountId } from "_/components/AccountId"
import { Box, Column, Columns } from "_/components/library"
import { useAdminApi } from "_/hooks/useAdminApi"
import { webapp } from "_/routing/webapp"
import { AccountKey, isAccountKey } from "@workspace/models"
import { FC, useEffect } from "react"

type AccountItem = AccountKey & {
	href: string
}

export const Accounts: FC = () => {
	const READ = useAdminApi.ListAccountKeys()
	const { data } = READ

	const accountItems: AccountItem[] = []

	if (Array.isArray(data)) {
		for (const item of data)
			if (isAccountKey(item))
				accountItems.push({
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
					size={{
						tablet: "half",
						fullhd: "one-third"
					}}
				>
					<a href={href} tabIndex={0}>
						<Box>
							<AccountId value={accountId} />
						</Box>
					</a>
				</Column>
			))}
		</Columns>
	)
}
