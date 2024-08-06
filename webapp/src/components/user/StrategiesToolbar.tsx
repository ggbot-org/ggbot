import { classnames } from "_/classnames"
import { Checkbox } from "_/components/library"
import { localWebStorage } from "_/storages/local"
import { FormattedMessage } from "react-intl"

export function StrategiesToolbar({ hideInactive, setHideInactive, isInvisible }: Partial<{
	hideInactive: boolean | undefined
	setHideInactive: (value: boolean | undefined) => void
	isInvisible: boolean
}>) {
	return (
		<div className={classnames("is-flex", "mb-5", "ml-3", { "is-invisible": isInvisible })}>
			<Checkbox
				checked={hideInactive}
				onChange={(event) => {
					if (!setHideInactive) return
					setHideInactive(event.target.checked)
					localWebStorage.hideInactiveStrategies.set(event.target.checked)
				}}
			>
				<FormattedMessage id="Strategies.hideInactive" />
			</Checkbox>
		</div>
	)
}
