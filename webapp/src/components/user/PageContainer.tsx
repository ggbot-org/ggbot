import { Page } from "_/components/library"
import { NoNetwork } from "_/components/NoNetwork"
import { Navigation } from "_/components/user/Navigation"
import { AuthenticationProvider } from "_/contexts/Authentication"
import { I18nProvider } from "_/contexts/I18n"
import { ToastProvider } from "_/contexts/Toast"
import { FC, PropsWithChildren } from "react"

export const PageContainer: FC<PropsWithChildren> = ({ children }) => (
	<I18nProvider>
		<AuthenticationProvider>
			<Page>
				<Navigation />

				<NoNetwork />

				<ToastProvider>{children}</ToastProvider>
			</Page>
		</AuthenticationProvider>
	</I18nProvider>
)
