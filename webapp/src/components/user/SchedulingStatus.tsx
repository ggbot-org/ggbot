import { MainColor, Tag, Tags } from '_/components/library'
import { SchedulingStatus as Status } from '@workspace/models'
import { FormattedMessage } from 'react-intl'

const colorOf: Record<
	Status,
	Extract<MainColor, 'primary' | 'danger'> | undefined
> = {
	active: 'primary',
	inactive: undefined,
	suspended: 'danger'
}

type _TagLabelProps = {
	status: Status | undefined
}

function _TagLabel({ status }: _TagLabelProps) {
	if (!status) return null
	return (
		<Tag bulma={['is-unselectable', 'is-uppercase']} color={colorOf[status]}>
			<FormattedMessage id={`SchedulingStatus.${status}`} />
		</Tag>
	)
}

type SchedulingStatusProps = Pick<_TagLabelProps, 'status'> & {
	count?: number
}

export function SchedulingStatus({ status, count }: SchedulingStatusProps) {
	if (count === undefined) return <_TagLabel status={status} />
	if (count === 0) return null
	return (
		<Tags hasAddons>
			<_TagLabel status={status} />
			<Tag color={status ? colorOf[status] : undefined}>{count}</Tag>
		</Tags>
	)
}
