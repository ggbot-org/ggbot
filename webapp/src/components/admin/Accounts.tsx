import { classnames } from '_/classnames'
import { Column, Columns, Div } from '_/components/library'
import { AccountId, Email } from '_/components/readonlyFields'
import { useListAccounts } from '_/hooks/admin/api'
import { GOTO } from '_/routing/navigation'
import { webapp } from '_/routing/webapp'
import { Account, AccountKey } from '@workspace/models'
import { useEffect } from 'react'

function AccountItem({
	accountId,
	email,
	isLoading,
}: AccountKey & Pick<Account, 'email'> & Partial<{ isLoading: boolean }>) {
	return (
		<Column>
			<Div
				bulma={classnames('box', {
					'is-clickable': !isLoading,
					'skeleton-block': isLoading,
				})}
				onClick={() => GOTO(webapp.admin.accountDetails({ accountId }))}
			>
				<AccountId value={accountId} />
				<Email value={email} />
			</Div>
		</Column>
	)
}

export function Accounts() {
	const { data, canRun, request, isPending } = useListAccounts()

	const items: Account[] = data ? data.accounts : []

	useEffect(() => {
		// TODO ListAccounts input accepts token to implement pagination
		if (canRun) request({ token: undefined, numItems: 100 })
	}, [canRun, request])

	if (isPending)
		return (
			<Columns isMultiline>
				<Column bulma={['is-half-tablet', 'is-one-third-desktop']}>
					<AccountItem accountId="" email="" />
				</Column>
			</Columns>
		)

	return (
		<Columns isMultiline>
			{items.map(({ id, email }) => (
				<Column key={id} bulma={['is-half-tablet', 'is-one-third-desktop']}>
					<AccountItem accountId={id} email={email} />
				</Column>
			))}
		</Columns>
	)
}
