import { Page, ToastProvider } from "@ggbot2/design"
import { FC, PropsWithChildren } from "react"

import { Footer } from "../components/Footer.js"
import { Navigation, NavigationProps } from "../components/Navigation.js"
import { NoNetwork } from "../components/NoNetwork.js"

type Props = Pick<NavigationProps, "noMenu">

export const PageContainer: FC<PropsWithChildren<Props>> = ({
	children,
	noMenu
}) => (
	<Page footer={<Footer />}>
		<Navigation noMenu={noMenu} />

		<NoNetwork />

		<ToastProvider>{children}</ToastProvider>
	</Page>
)
