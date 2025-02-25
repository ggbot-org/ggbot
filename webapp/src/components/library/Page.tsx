import { Classname } from '_/classnames'
import { PropsWithChildren, ReactNode } from 'react'

export function Page({
	footer,
	header,
	children,
}: PropsWithChildren<{
	header: ReactNode
	footer?: ReactNode
}>) {
	return (
		<div className={'page' satisfies Classname}>
			{header}
			<div className={'page__content' satisfies Classname}>{children}</div>
			{footer ? (
				<div className={'page__footer' satisfies Classname}>{footer}</div>
			) : null}
		</div>
	)
}
