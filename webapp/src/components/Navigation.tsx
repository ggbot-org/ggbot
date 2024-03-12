import { Navbar } from "_/components/library"
import { FC } from "react"

export const Navigation: FC = () => {
	if (location.pathname === "/") return null

	return <Navbar noMenu />
}
