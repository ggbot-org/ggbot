import { Classname } from '_/classnames'
import { PropsWithChildren } from 'react'
import { Label as _Label, LabelProps as _LabelProps } from 'trunx'

type LabelProps = Omit<_LabelProps, 'className'>

export function Label({ children, ...props }: PropsWithChildren<LabelProps>) {
	return (
		<_Label className={'is-unselectable' satisfies Classname} {...props}>
			{children}
		</_Label>
	)
}
