import { Classname } from '_/classnames'
import { PropsWithChildren } from 'react'
import { Column, Columns } from 'trunx'

export function OneColumn({ children }: PropsWithChildren) {
	return (
		<Columns>
			<Column className={'one-column' satisfies Classname}>{children}</Column>
		</Columns>
	)
}
