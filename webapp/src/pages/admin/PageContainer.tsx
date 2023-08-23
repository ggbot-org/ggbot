import { Footer } from "_/components/Footer.js"
import { Page } from "_/components/library"
import { Navigation } from "_/components/Navigation.js"
import { NoNetwork } from "_/components/NoNetwork.js"
import { AuthenticationProvider } from "_/contexts/Authentication.js"
import { I18nProvider } from "_/contexts/I18n"
import { ToastProvider } from "_/contexts/Toast.js"
import { FC, PropsWithChildren } from "react"

export const PageContainer: FC<PropsWithChildren> = ({ children }) => (
	<I18nProvider>
		<AuthenticationProvider>
			<Page footer={<Footer />}>
				<Navigation />

				<NoNetwork />

				<ToastProvider>{children}</ToastProvider>
			</Page>
		</AuthenticationProvider>
	</I18nProvider>
)
