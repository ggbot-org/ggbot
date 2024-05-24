import { Footer } from "_/components/Footer"
import { Page } from "_/components/library"
import { Navigation } from "_/components/Navigation"
import { NoNetwork } from "_/components/NoNetwork"
import { I18nProvider } from "_/contexts/I18n"
import { ToastProvider } from "_/contexts/Toast"
import { PropsWithChildren } from "react"

export function PageContainer({ children }: PropsWithChildren) {
	return (
		<I18nProvider>
			<Page footer={<Footer />}>
				<Navigation />

				<NoNetwork />

				<ToastProvider>{children}</ToastProvider>
			</Page>
		</I18nProvider>
	)
}
