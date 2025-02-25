import { classnames } from '_/classnames'
import { PropsWithChildren } from 'react'

export type ToolbarProps = Partial<{
	isInvisible: boolean
}>

export function Toolbar({
	isInvisible,
	children,
}: PropsWithChildren<ToolbarProps>) {
	return (
		<div
			className={classnames('is-flex', 'mb-5', 'ml-3', {
				'is-invisible': isInvisible,
			})}
		>
			{children}
		</div>
	)
}
