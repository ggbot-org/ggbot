import { dayFormat } from "_/i18n/formats"
import { FC, useCallback } from "react"
import { FormattedDate } from "react-intl"
import { Control, Field } from "trunx"

import { Calendar, CalendarProps } from "./Calendar"
import {
	Dropdown,
	DropdownMenu,
	DropdownProps,
	DropdownTrigger
} from "./DropDown"
import { Label } from "./Label"

export type DayDropdownProps = Partial<{ disabled: boolean }> &
	Required<Pick<DropdownProps, "isActive" | "onClick">> &
	Pick<DropdownProps, "isRight"> &
	Pick<CalendarProps, "day" | "setDay" | "min" | "max"> & {
		label: string
	} & { close: () => void }

export const DayDropdown: FC<DayDropdownProps> = ({
	close,
	day,
	disabled,
	isActive,
	isRight,
	label,
	max,
	min,
	onClick,
	setDay
}) => (
	<Field>
		<Label>{label}</Label>

		<Control>
			<Dropdown
				isActive={disabled ? undefined : isActive}
				isRight={isRight}
				onClick={disabled ? undefined : onClick}
			>
				<DropdownTrigger disabled={disabled}>
					<FormattedDate value={day} {...dayFormat} />
				</DropdownTrigger>

				<DropdownMenu>
					<Calendar
						day={day}
						setDay={useCallback<DayDropdownProps["setDay"]>(
							(day) => {
								setDay(day)
								close()
							},
							[close, setDay]
						)}
						min={min}
						max={max}
					/>
				</DropdownMenu>
			</Dropdown>
		</Control>
	</Field>
)
