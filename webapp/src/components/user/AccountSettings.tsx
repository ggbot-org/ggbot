import { Columns, OneColumn } from "_/components/library"
import { AccountInfo } from "_/components/user/AccountInfo"
import { DeleteAccount } from "_/components/user/DeleteAccount"

export function AccountSettings() {
	return (
		<>
			<Columns>
				<OneColumn>
					<AccountInfo />
				</OneColumn>
			</Columns>

			<DeleteAccount />
		</>
	)
}
