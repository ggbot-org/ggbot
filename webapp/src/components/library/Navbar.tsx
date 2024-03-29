import { classNames } from "_/classNames"
import { webapp } from "_/routing/webapp"
import { FC, PropsWithChildren, useEffect, useState } from "react"
import {
	Navbar as _Navbar,
	NavbarBrand,
	NavbarBurger,
	NavbarItem,
	NavbarMenu
} from "trunx"

import { BrandName } from "./BrandName"
import { Logo } from "./Logo"

type Props = Partial<{
	noMenu: boolean
}>

export const Navbar: FC<PropsWithChildren<Props>> = ({
	children,
	noMenu,
	...props
}) => {
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
		<_Navbar color="black" {...props}>
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
				<NavbarItem className={classNames("is-unselectable")}>
					<Logo size={34} />

					<BrandName />
				</NavbarItem>

				{noMenu || (
					<NavbarBurger
						isActive={isActive}
						setIsActive={setIsActive}
					/>
				)}
			</NavbarBrand>

			{noMenu || <NavbarMenu isActive={isActive}>{children}</NavbarMenu>}
		</_Navbar>
	)
}
