import { Page, ToastProvider } from "@ggbot2/design"
import { I18nProvider } from "@ggbot2/i18n"
import { FC, PropsWithChildren } from "react"

import { Footer } from "../../components/Footer.js"
import { Navigation } from "../../components/Navigation.js"
import { NoNetwork } from "../../components/NoNetwork.js"
import { AuthenticationProvider } from "../../contexts/Authentication.js"

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
