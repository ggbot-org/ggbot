import { FC } from "react"
import { useIntl } from "react-intl"

import { Name, NameProps } from "../components/Name.js"

type Props = Omit<NameProps, "label">

export const StrategyName: FC<Props> = (props) => {
	const { formatMessage } = useIntl()

	return (
		<Name label={formatMessage({ id: "StrategyName.label" })} {...props} />
	)
}
