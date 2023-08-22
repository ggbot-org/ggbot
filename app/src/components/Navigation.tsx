import { Navbar } from "@ggbot2/design"
import { memo } from "react"

export const Navigation = memo(() => {
	if (window.location.pathname === "/") return null

	return <Navbar noMenu />
})

Navigation.displayName = "Navigation"
