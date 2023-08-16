import { Container, ToastProvider } from "@ggbot2/design"
import { FC, PropsWithChildren } from "react"

import { Navigation, NavigationProps } from "../components/Navigation.js"
import { NoNetwork } from "../components/NoNetwork.js"

type Props = Pick<NavigationProps, "noMenu">

export const PageContainer: FC<PropsWithChildren<Props>> = ({
	children,
	noMenu
}) => (
	<>
		<Navigation noMenu={noMenu} />

		<Container maxWidth="desktop">
			<NoNetwork />
		</Container>

		<ToastProvider>{children}</ToastProvider>
	</>
)
