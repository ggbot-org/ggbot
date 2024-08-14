import { Checkbox } from "_/components/library"
import { Toolbar, ToolbarProps } from "_/components/Toolbar"
import { localWebStorage } from "_/storages/local"
import { FormattedMessage } from "react-intl"

export function StrategiesToolbar({ hideInactive, setHideInactive, isInvisible }: Partial<{
	hideInactive: boolean | undefined
	setHideInactive: (value: boolean | undefined) => void
}> & ToolbarProps) {
	return (
		<Toolbar isInvisible={isInvisible}>
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
		</Toolbar>
	)
}
