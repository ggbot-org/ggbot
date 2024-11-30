import { Classname } from '_/classnames'
import { PropsWithChildren } from 'react'

export function Paragraph({ children }: PropsWithChildren) {
	return <p className={'paragraph' satisfies Classname}>{children}</p>
}
