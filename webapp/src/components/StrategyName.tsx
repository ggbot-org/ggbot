import { Name, NameProps } from "_/components/library"
import { FormattedMessage } from "react-intl"

export function StrategyName(props: Omit<NameProps, "label">) {
	return (
		<Name label={<FormattedMessage id="StrategyName.label" />} {...props} />
	)
}
