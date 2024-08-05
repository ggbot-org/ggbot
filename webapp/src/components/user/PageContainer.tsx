import { Page } from "_/components/library"
import { Navigation } from "_/components/user/Navigation"
import { AuthenticationProvider } from "_/contexts/Authentication"
import { I18nProvider } from "_/contexts/I18n"
import { ToastProvider } from "_/contexts/Toast"
import { PropsWithChildren } from "react"

export function PageContainer({ children }: PropsWithChildren) {
	return (
		<I18nProvider>
			<AuthenticationProvider>
				<Page>
					<Navigation />

					<ToastProvider>
						{children}
					</ToastProvider>
				</Page>
			</AuthenticationProvider>
		</I18nProvider>
	)
}
