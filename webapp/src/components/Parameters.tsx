import { Box, Title } from "_/components/library"
import { DflowCommonContext } from "@workspace/dflow"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

import { ParametersItem, ParametersItemProps } from "./ParamtersItem"

type Props = { params: DflowCommonContext["params"] | undefined }

export const Parameters: FC<Props> = ({ params }) => {
	const items: ParametersItemProps[] = []

	if (params)
		for (const [key, value] of Object.entries(params))
			items.push({ name: key, value })

	return (
		<Box>
			<Title>
				<FormattedMessage id="Parameters.title" />
			</Title>

			{items.length === 0 && (
				<span>
					<FormattedMessage id="Parameters.empty" />
				</span>
			)}

			<div>
				{items.map(({ name, value }) => (
					<ParametersItem key={name} name={name} value={value} />
				))}
			</div>
		</Box>
	)
}
