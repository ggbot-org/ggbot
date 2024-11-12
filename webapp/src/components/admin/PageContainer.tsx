import { Navigation } from '_/components/admin/Navigation'
import { Page } from '_/components/library'
import { NoNetwork } from '_/components/NoNetwork'
import { AuthenticationProvider } from '_/contexts/Authentication'
import { PropsWithChildren } from 'react'

export function PageContainer({ children }: PropsWithChildren) {
	return (
		<AuthenticationProvider>
			<Page header={
				<>
					<NoNetwork />
					<Navigation />
				</>
			}
			>
				{children}
			</Page>
		</AuthenticationProvider>
	)
}
