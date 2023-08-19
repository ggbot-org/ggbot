import { Page, ToastProvider } from "@ggbot2/design"
import { FC, PropsWithChildren } from "react"

import { Footer } from "../Footer.js"
import { NoNetwork } from "../NoNetwork.js"
import { Navigation } from "./Navigation.js"

export const PageContainer: FC<PropsWithChildren> = ({ children }) => (
	<Page footer={<Footer />}>
		<Navigation />

		<NoNetwork />

		<ToastProvider>{children}</ToastProvider>
	</Page>
)
