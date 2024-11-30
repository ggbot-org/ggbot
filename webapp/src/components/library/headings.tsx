import { Classname } from '_/classnames'
import { PropsWithChildren } from 'react'

export function H1({ children }: PropsWithChildren) {
	return <h1 className={'is-size-1' satisfies Classname}>{children}</h1>
}

export function H2({ children }: PropsWithChildren) {
	return <h2 className={'is-size-2' satisfies Classname}>{children}</h2>
}

export function H3({ children }: PropsWithChildren) {
	return <h3 className={'is-size-3' satisfies Classname}>{children}</h3>
}
