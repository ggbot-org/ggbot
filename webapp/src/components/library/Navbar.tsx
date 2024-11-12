import { webapp } from '_/routing/webapp'
import { PropsWithChildren, useEffect, useState } from 'react'
import { Navbar as _Navbar, NavbarBrand, NavbarBurger, NavbarItem, NavbarLink as _NavbarLink, NavbarLinkProps, NavbarMenu, NavbarProps } from 'trunx'

import { BrandName } from './brand'

export function Navbar({ children, noMenu }: PropsWithChildren<
	Partial<{ noMenu: boolean }> & Pick<NavbarProps, 'className'>
>) {
	const [isActive, setIsActive] = useState(false)

	// Close menu on outside click.
	useEffect(() => {
		function closeMenu() {
			setIsActive(false)
		}
		addEventListener('click', closeMenu)
		return () => removeEventListener('click', closeMenu)
	}, [])

	return (
		<_Navbar color="black">
			<NavbarBrand>
				<NavbarItem
					onClick={() => {
						const { pathname } = location
						if (
							pathname === '/' ||
							pathname === webapp.homepage.pathname
						) return
						location.pathname = '/'
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

export function NavbarLink({
	children, ...props
}: PropsWithChildren<Exclude<NavbarLinkProps, 'isArrowless'>>) {
	return (
		<_NavbarLink
			isArrowless
			{...props}
		>
			{children}
		</_NavbarLink>
	)
}
