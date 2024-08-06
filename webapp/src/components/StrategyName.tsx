import { Name, NameProps } from "_/components/library"
import { useIntl } from "react-intl"

export function StrategyName(props: Omit<NameProps, "label">) {
	const { formatMessage } = useIntl()
	return (
		<Name label={formatMessage({ id: "StrategyName.label" })} {...props} />
	)
}
