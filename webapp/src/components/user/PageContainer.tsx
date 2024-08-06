import { Page } from "_/components/library"
import { Navigation } from "_/components/user/Navigation"
import { AuthenticationProvider } from "_/contexts/Authentication"
import { ToastProvider } from "_/contexts/Toast"
import { PropsWithChildren } from "react"

export function PageContainer({ children }: PropsWithChildren) {
	return (
		<AuthenticationProvider>
			<Page>
				<Navigation />
				<ToastProvider>
					{children}
				</ToastProvider>
			</Page>
		</AuthenticationProvider>
	)
}
