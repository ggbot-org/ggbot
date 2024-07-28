import { classnames } from "_/classnames"
import { LabelHTMLAttributes, PropsWithChildren } from "react"
import { Label as _Label, LabelProps as _LabelProps } from "trunx"

// TODO update trunx then remove LabelHTMLAttributes fix
type LabelProps = Omit<_LabelProps, "className"> &
	Pick<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor">

export function Label({ children, ...props }: PropsWithChildren<LabelProps>) {
	return (
		<_Label className={classnames("is-unselectable")} {...props}>
			{children}
		</_Label>
	)
}
