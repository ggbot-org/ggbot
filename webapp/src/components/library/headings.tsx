import { classnames } from '_/classnames'
import { PropsWithChildren } from 'react'

export function H1({ children }: PropsWithChildren) {
	return <h1 className={classnames('is-size-1')}>{children}</h1>
}

export function H2({ children }: PropsWithChildren) {
	return <h2 className={classnames('is-size-2')}>{children}</h2>
}

export function H3({ children }: PropsWithChildren) {
	return <h2 className={classnames('is-size-3')}>{children}</h2>
}
