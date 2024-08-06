import { FormattedMessage } from "react-intl"
import { SizeProp, Span } from "trunx"

export function BrandName({ size }: Partial<SizeProp<"large">>) {
	return (
		<Span
			bulma={[
				"is-unselectable",
				"has-text-weight-semibold",
				{
					"is-size-1": size === "large",
					"is-size-5": size === undefined
				}
			]}
		>
			<FormattedMessage
				id="BrandName.label"
				values={{ name: PROJECT_SHORT_NAME }}
			/>
		</Span>
	)
}
