import { classnames } from '_/classnames'
import { FormattedMessage } from '_/i18n/components'
import { SizeProp, Span } from 'trunx'

// TODO this should not use translations, use a logotype instead
export function BrandName({ size }: Partial<SizeProp<'large'>>) {
	return (
		<Span
			bulma={[
				'is-unselectable',
				'has-text-weight-semibold',
				{
					'is-size-1': size === 'large',
					'is-size-5': size === undefined,
				},
			]}
		>
			<FormattedMessage id="Brand.name" values={{ name: PROJECT_SHORT_NAME }} />
		</Span>
	)
}

export function BrandTagline({ animated }: { animated?: boolean }) {
	return (
		<div
			className={classnames(
				{ 'brand-tagline--animated': animated },
				'is-unselectable',
				'is-italic'
			)}
		>
			<FormattedMessage id="Brand.tagline" />
		</div>
	)
}

export function Logo({
	animated,
	size,
}: {
	animated?: boolean
	size?: number
}) {
	return (
		<svg
			fill="none"
			height={size}
			viewBox="0 0 512 512"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="256" cy="256" r="255" />
			<path d="M96 154.426l160 92.376v189L96 343.426z" fill="#16e0c8">
				{animated ? (
					<animate
						attributeName="fill-opacity"
						begin="0.4s"
						dur="1s"
						repeatCount="1"
						values="0;1"
					/>
				) : null}
			</path>
			<path d="M256 247.198l160-92.376v189l-160 92.376z" fill="#6adbc6">
				{animated ? (
					<animate
						attributeName="fill-opacity"
						begin="0.8s"
						dur="1s"
						repeatCount="1"
						values="0;1"
					/>
				) : null}
			</path>
			<path
				d="M256.142 63.392l160.09 92.207-160.09 92.207-160.089-92.207z"
				fill="#28ebc6"
			>
				{animated ? (
					<animate
						attributeName="fill-opacity"
						begin="0s"
						dur="1s"
						repeatCount="1"
						values="0;1"
					/>
				) : null}
			</path>
			<path d="M416 155L256 64v107l66 38z">
				{animated ? (
					<animate
						attributeName="fill-opacity"
						begin="0.4s"
						dur="0.1s"
						fill="freeze"
						repeatCount="1"
						values="0;0.17"
					/>
				) : null}
			</path>
			<path d="M256 435V330l67-39 93 52z">
				{animated ? (
					<animate
						attributeName="fill-opacity"
						begin="0.4s"
						dur="0.1s"
						fill="freeze"
						repeatCount="1"
						values="0;0.17"
					/>
				) : null}
			</path>
			<path d="M189 210l-92-55v188l92-52z">
				{animated ? (
					<animate
						attributeName="fill-opacity"
						begin="0.4s"
						dur="0.1s"
						fill="freeze"
						repeatCount="1"
						values="0;0.17"
					/>
				) : null}
			</path>
			<g fill="#333" fillOpacity=".17">
				<path d="M195 213.583l60 34.641v74l-60-34.64z">
					{animated ? (
						<animate
							attributeName="width"
							begin="0s"
							dur="0.4s"
							repeatCount="1"
							values="0;60"
						/>
					) : null}
				</path>
				<path d="M257 248.621l60-34.641v74l-60 34.641z">
					{animated ? (
						<animate
							attributeName="width"
							begin="0s"
							dur="0.4s"
							repeatCount="1"
							values="0;60"
						/>
					) : null}
				</path>
				<path d="M256.142 177.498l60.034 34.577-60.034 34.578-60.033-34.578z">
					{animated ? (
						<animate
							attributeName="width"
							begin="0s"
							dur="0.4s"
							repeatCount="1"
							values="0;60"
						/>
					) : null}
				</path>
			</g>
			<path
				d="M416 155L256 64 97 155v188l159 92 160-92V230l-66 41"
				stroke="#09eae5"
				strokeDasharray="1114"
				strokeWidth="17"
			>
				{animated ? (
					<animate
						attributeName="stroke-dashoffset"
						dur="1.2s"
						repeatCount="1"
						values="1114;0"
					/>
				) : null}
			</path>
			<circle cx="416" cy="155" fill="#09eae5" r="9" />
			<circle cx="350" cy="271" fill="#09eae5" r="0">
				{animated ? (
					<animate
						attributeName="r"
						begin="1.17s"
						dur="0.25s"
						fill="freeze"
						repeatCount="1"
						values="0;17;9"
					/>
				) : null}
			</circle>
			<path
				d="M322 209l-66-38-67 39v81l67 39 67-39v-41l-38 21"
				stroke="#333"
				strokeDasharray="1114"
				strokeWidth="17"
			/>
			<circle cx="322" cy="209" fill="#333" r="9" />
			<circle cx="285" cy="271" fill="#333" r="9" />
		</svg>
	)
}
