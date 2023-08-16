import { Box, Flex, Title } from "@ggbot2/design"
import { DflowCommonContext } from "@ggbot2/dflow"
import { DflowData } from "dflow"
import { FC, useMemo } from "react"
import { FormattedMessage } from "react-intl"

type Props = { memory: DflowCommonContext["memory"] | undefined }

type MemoryItemProps = { name: string; value: DflowData | undefined }

const MemoryItem: FC<MemoryItemProps> = ({ name, value }) => {
	const formattedValue = useMemo<string>(() => {
		if (value === undefined) return ""
		return JSON.stringify(value, null, 2)
	}, [value])

	return (
		<Flex>
			<span>{name}</span>

			<pre>
				<code>{formattedValue}</code>
			</pre>
		</Flex>
	)
}

export const Memory: FC<Props> = ({ memory }) => {
	const memoryItems = useMemo<MemoryItemProps[]>(() => {
		if (!memory) return []
		return Object.entries(memory).map(([name, value]) => ({
			name,
			value
		}))
	}, [memory])

	return (
		<Box>
			<Title>
				<FormattedMessage id="Memory.title" />
			</Title>

			{memoryItems.length === 0 && (
				<span>
					<FormattedMessage id="Memory.empty" />
				</span>
			)}

			<div>
				{memoryItems.map(({ name, value }) => (
					<MemoryItem key={name} name={name} value={value} />
				))}
			</div>
		</Box>
	)
}
