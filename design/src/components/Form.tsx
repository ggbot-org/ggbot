import {
	FC,
	FormEventHandler,
	FormHTMLAttributes,
	PropsWithChildren
} from "react"

import { classNames } from "../components/classNames.js"

export type FormProps = FormHTMLAttributes<HTMLFormElement>

export const Form: FC<PropsWithChildren<FormProps>> = ({
	children,
	...props
}) => (
	<form className={classNames("box")} {...props}>
		{children}
	</form>
)

export type FormOnReset = FormEventHandler<HTMLFormElement>

export type FormOnSubmit = FormEventHandler<HTMLFormElement>
