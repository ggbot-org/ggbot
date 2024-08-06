import { Footer } from "_/components/Footer"
import { Navbar, Page } from "_/components/library"
import { NoNetwork } from "_/components/NoNetwork"
import { ToastProvider } from "_/contexts/Toast"
import { PropsWithChildren } from "react"

function isHomepage() {
	const url = new URL(location.href)
	if (url.pathname === "/") return true
	if (url.pathname === "/index.html") return true
	return false
}

export function PageContainer({ children }: PropsWithChildren) {
	return (
		<Page footer={<Footer />}>
			{isHomepage() ? null : <Navbar noMenu />}
			<NoNetwork />
			<ToastProvider>{children}</ToastProvider>
		</Page>
	)
}
