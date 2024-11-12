// TODO add Level and LevelItem to trunx, then remove this file
import { classnames } from '_/classnames'
import { HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { BulmaProp } from 'trunx'

type LevelProps = HTMLAttributes<HTMLDivElement> &
	BulmaProp &
	Partial<{
		left: ReactNode
		right: ReactNode
		isMobile: boolean
	}>

export function Level({
	bulma,
	isMobile,
	left,
	right,
	children,
	...props
}: PropsWithChildren<LevelProps>) {
	return (
		<div
			className={classnames('level', { 'is-mobile': isMobile }, bulma)}
			{...props}
		>
			{left ? <div className="level-left">{left}</div> : null}
			{children}
			{right ? <div className="level-right">{right}</div> : null}
		</div>
	)
}

type LevelItemProps = HTMLAttributes<HTMLDivElement> & BulmaProp

export function LevelItem({
	bulma,
	children,
	...props
}: PropsWithChildren<LevelItemProps>) {
	return (
		<div className={classnames('level-item', bulma)} {...props}>
			{children}
		</div>
	)
}
