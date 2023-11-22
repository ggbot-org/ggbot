import { dayFormat } from "_/i18n/formats"
import { FC, useCallback } from "react"
import { FormattedDate } from "react-intl"
import {
	Control,
	Dropdown,
	DropdownMenu,
	DropdownProps,
	DropdownTrigger,
	Field
} from "trunx"

import { Calendar, CalendarProps } from "./Calendar"
import { Label } from "./Label"

export type DayDropdownProps = Required<
	Pick<DropdownProps, "isActive" | "onClick">
> &
	Pick<CalendarProps, "day" | "setDay" | "min" | "max"> & {
		label: string
	} & { close: () => void }

export const DayDropdown: FC<DayDropdownProps> = ({
	close,
	day,
	isActive,
	label,
	onClick,
	setDay,
	min,
	max
}) => (
	<Field>
		<Label>{label}</Label>

		<Control>
			<Dropdown isActive={isActive} onClick={onClick}>
				<DropdownTrigger>
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
