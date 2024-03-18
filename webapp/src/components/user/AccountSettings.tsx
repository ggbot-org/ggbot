import { Columns, OneColumn } from "_/components/library"
import { AccountInfo } from "_/components/user/AccountInfo"
import { DeleteAccount } from "_/components/user/DeleteAccount"
import { FC } from "react"

export const AccountSettings: FC = () => (
	<>
		<Columns>
			<OneColumn>
				<AccountInfo />
			</OneColumn>
		</Columns>

		<DeleteAccount />
	</>
)
