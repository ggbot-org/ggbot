import { Page } from "_/components/library"
import { Navigation } from "_/components/user/Navigation"
import { AuthenticationProvider } from "_/contexts/Authentication"
import { I18nProvider } from "_/contexts/I18n"
import { FC, PropsWithChildren } from "react"

export const PageContainer: FC<PropsWithChildren> = ({ children }) => (
	<I18nProvider>
		<AuthenticationProvider>
			<Page>
				<Navigation />

				{children}
			</Page>
		</AuthenticationProvider>
	</I18nProvider>
)
