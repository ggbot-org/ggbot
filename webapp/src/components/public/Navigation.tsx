import { Navbar } from '_/components/library'

// TODO refactor Navbar and remove noMenu boolean
// move related code here and use composition
export function Navigation() {
	return <Navbar noMenu />
}
