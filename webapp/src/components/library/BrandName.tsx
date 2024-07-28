import { classnames } from "_/classnames"
import { FormattedMessage } from "react-intl"
import { SizeProp } from "trunx"

type Props = SizeProp<"medium" | "normal" | "large">

export function BrandName({ size = "normal" }: Props) {
	return (
		<span
			className={classnames({
				"is-size-1": size === "large",
				"has-text-weight-semibold": size === "large",
				"has-text-weight-medium":
					size === "medium" || size === "normal",
				"is-size-3": size === "medium",
				"is-size-5": size === "normal",
				"mb-1": size === "normal"
			})}
		>
			<FormattedMessage
				id="BrandName.label"
				values={{ name: PROJECT_SHORT_NAME }}
			/>
		</span>
	)
}
