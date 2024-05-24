import { Navbar } from "_/components/library"
import { isHomepage } from "_/routing/isHomepage"

export function Navigation() {
	// Hide this component in Homepage
	if (isHomepage()) return null

	return <Navbar noMenu className="Navigation" />
}
