// TODO add Dropdown component to trunx, then remove this
import { classnames } from "_/classnames"
import { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react"

export type DropdownProps = HTMLAttributes<HTMLDivElement> &
	Partial<{
		isActive: boolean
		isRight: boolean
	}>

export function Dropdown({
	children,
	isActive,
	isRight,
	...props
}: DropdownProps) {
	return (
		<div
			className={classnames("dropdown", {
				"is-active": isActive,
				"is-right": isRight
			})}
			{...props}
		>
			{children}
		</div>
	)
}

type DropdownMenuProps = HTMLAttributes<HTMLDivElement>

export function DropdownMenu({
	children,
	...props
}: PropsWithChildren<DropdownMenuProps>) {
	return (
		<div className="dropdown-menu" {...props}>
			<div className="dropdown-content">{children}</div>
		</div>
	)
}

type DropdownTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>

export function DropdownTrigger({
	children,
	...props
}: PropsWithChildren<DropdownTriggerProps>) {
	return (
		<div className="dropdown-trigger">
			<button className={classnames("button")} {...props}>
				{children}
			</button>
		</div>
	)
}
