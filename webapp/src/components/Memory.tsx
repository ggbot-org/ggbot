import { Box, Title } from "_/components/library"
import { DflowCommonContext } from "@workspace/dflow"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import { MemoryItem, MemoryItemProps } from "./MemoryItem"

type Props = { memory: DflowCommonContext["memory"] | undefined }

export const Memory: FC<Props> = ({ memory }) => {
	const items: MemoryItemProps[] = []

	if (memory)
		for (const [key, value] of Object.entries(memory))
			items.push({ name: key, value })

	return (
		<Box>
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
		</Box>
	)
}
