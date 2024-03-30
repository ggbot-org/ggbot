import { Navbar } from "_/components/library"
import { isHomepage } from "_/routing/isHomepage"
import { FC } from "react"

export const Navigation: FC = () => {
	// Hide this component in Homepage
	if (isHomepage()) return null

	return <Navbar noMenu className="Navigation" />
}
