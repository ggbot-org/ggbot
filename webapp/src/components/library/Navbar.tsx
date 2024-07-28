import { classnames } from "_/classnames"
import { webapp } from "_/routing/webapp"
import {
	FC,
	HTMLAttributes,
	PropsWithChildren,
	useEffect,
	useState
} from "react"
import {
	Navbar as _Navbar,
	NavbarBurger,
	NavbarItem,
	NavbarMenu,
	NavbarProps
} from "trunx"

import { BrandName } from "./BrandName"
import { Logo } from "./Logo"

// Once updated trunx, remove this and import it from trunx
const NavbarBrand: FC<PropsWithChildren<NavbarBrandProps>> = ({
	children,
	...props
}) => (
	<div className="navbar-brand" {...props}>
		{children}
	</div>
)
type NavbarBrandProps = HTMLAttributes<HTMLDivElement>

type Props = Partial<{
	noMenu: boolean
}> &
	Pick<NavbarProps, "className">

export function Navbar({
	children,
	className,
	noMenu
}: PropsWithChildren<Props>) {
	const [isActive, setIsActive] = useState(false)

	// Close menu on outside click.
	useEffect(() => {
		const closeMenu = () => {
			setIsActive(false)
		}
		addEventListener("click", closeMenu)
		return () => {
			removeEventListener("click", closeMenu)
		}
	}, [])

	return (
		<_Navbar className={className} color="black">
			<NavbarBrand
				onClick={() => {
					const { pathname } = location
					if (
						pathname === "/" ||
						pathname === webapp.homepage.pathname
					)
						return
					location.pathname = "/"
				}}
			>
				<NavbarItem className={classnames("is-unselectable")}>
					<Logo size={34} />

					<BrandName />
				</NavbarItem>

				{noMenu || <NavbarBurger isActive={isActive} />}
			</NavbarBrand>

			{noMenu || <NavbarMenu isActive={isActive}>{children}</NavbarMenu>}
		</_Navbar>
	)
}
