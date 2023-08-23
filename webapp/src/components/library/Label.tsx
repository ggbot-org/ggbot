import { classNames } from "_/classNames"
import { FC, PropsWithChildren } from "react"
import { Label as _Label, LabelProps as _LabelProps } from "trunx"

type LabelProps = Omit<_LabelProps, "className">

export const Label: FC<PropsWithChildren<LabelProps>> = ({
	children,
	...props
}) => (
	<_Label className={classNames("is-unselectable")} {...props}>
		{children}
	</_Label>
)
