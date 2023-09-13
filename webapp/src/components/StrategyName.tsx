import { Name, NameProps } from "_/components/Name"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = Omit<NameProps, "label">

export const StrategyName: FC<Props> = (props) => {
	const { formatMessage } = useIntl()

	return (
		<Name label={formatMessage({ id: "StrategyName.label" })} {...props} />
	)
}
