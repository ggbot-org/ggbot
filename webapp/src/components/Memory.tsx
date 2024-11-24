import { classnames } from '_/classnames'
import { Div, Title } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'
import { DflowCommonContext } from '@workspace/dflow'
import { SerializablePrimitive } from '@workspace/models'

type MemoryItemProps = {
	name: string
	value: SerializablePrimitive | undefined
}

function MemoryItem({ name, value }: MemoryItemProps) {
	return (
		<div className={classnames('is-flex', 'is-flex-direction-column', 'my-1', 'is-flex-grow-1')}>
			<span>{name}</span>
			<pre className={classnames('p-2')}>
				<code>{
					value === undefined ? '' : JSON.stringify(value, null, 2)
				}
				</code>
			</pre>
		</div>
	)
}

export function Memory({ memory }: {
	memory: DflowCommonContext['memory'] | undefined
}) {
	const items: MemoryItemProps[] = []
	if (memory) {
		for (const [key, value] of Object.entries(memory)) items.push({ name: key, value })
	}
	return (
		<Div bulma="box">
			<Title>
				<FormattedMessage id="Memory.title" />
			</Title>
			{items.length === 0 && (
				<span>
					<FormattedMessage id="Memory.empty" />
				</span>
			)}
			<div>
				{items.map(({ name, value }) => (
					<MemoryItem key={name} name={name} value={value} />
				))}
			</div>
		</Div>
	)
}
