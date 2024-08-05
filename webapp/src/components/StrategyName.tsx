import { Name, NameProps } from "_/components/library"
import { useIntl } from "react-intl"

type Props = Omit<NameProps, "label">

export function StrategyName(props: Props) {
	const { formatMessage } = useIntl()
	return (
		<Name label={formatMessage({ id: "StrategyName.label" })} {...props} />
	)
}
