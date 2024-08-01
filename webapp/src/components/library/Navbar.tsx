import { classnames } from "_/classnames"
import { webapp } from "_/routing/webapp"
import { HTMLAttributes, PropsWithChildren, useEffect, useState } from "react"
import {
	Bulma,
	Navbar as _Navbar,
	NavbarBurger,
	NavbarItem,
	NavbarLink as _NavbarLink,
	NavbarLinkProps,
	NavbarMenu,
	NavbarProps
} from "trunx"

import { BrandName } from "./BrandName"

// Once updated trunx, remove this and import it from trunx
function NavbarBrand({
	children,
	...props
}: PropsWithChildren<NavbarBrandProps>) {
	return (
		<div className="navbar-brand" {...props}>
			{children}
		</div>
	)
}
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
		function closeMenu() {
			setIsActive(false)
		}
		addEventListener("click", closeMenu)
		return () => {
			removeEventListener("click", closeMenu)
		}
	}, [])

	return (
		<_Navbar className={className} color="black">
			<NavbarBrand>
				<NavbarItem
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
					<BrandName />
				</NavbarItem>

				{noMenu || (
					<NavbarBurger
						isActive={isActive}
						onClick={(event) => {
							event.stopPropagation()
							setIsActive((isActive) => !isActive)
						}}
					/>
				)}
			</NavbarBrand>

			{noMenu || <NavbarMenu isActive={isActive}>{children}</NavbarMenu>}
		</_Navbar>
	)
}

// TODO trunx has no is-arrowless class in Bulma, find a way to fix it
// for example add missing classes manually (they are all inside a :not())
// and add a test to make sure typings are working
export function NavbarLink({
	className,
	children,
	...props
}: PropsWithChildren<NavbarLinkProps>) {
	return (
		<_NavbarLink
			className={classnames("is-arrowless" as Bulma, className as Bulma)}
			{...props}
		>
			{children}
		</_NavbarLink>
	)
}
