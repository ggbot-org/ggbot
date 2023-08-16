import { FC, PropsWithChildren, useEffect, useState } from "react"
import {
	Navbar as _Navbar,
	NavbarBrand,
	NavbarBurger,
	NavbarItem,
	NavbarMenu
} from "trunx"

import { _classNames } from "../components/_classNames.js"
import { BrandName } from "../components/BrandName.js"
import { Logo } from "../components/Logo.js"

export type NavbarProps = Partial<{
	noMenu: boolean
}>

export const Navbar: FC<PropsWithChildren<NavbarProps>> = ({
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
		window.addEventListener("click", closeMenu)
		return () => {
			window.removeEventListener("click", closeMenu)
		}
	}, [])

	return (
		<_Navbar color="black" {...props}>
			<NavbarBrand>
				<NavbarItem className={_classNames("is-unselectable")}>
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
