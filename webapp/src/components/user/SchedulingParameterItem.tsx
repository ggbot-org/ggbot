import { InputField } from "_/components/library"
import {
	BooleanParameter,
	DflowBinanceSymbolInfo,
	dflowBinanceSymbolSeparator,
	IntervalParameter,
	isDflowBinanceKlineInterval,
	NumberParameter,
	StringParameter,
	SymbolParameter
} from "@workspace/dflow"
import {
	IdentifierString,
	isFiniteNumber,
	isFiniteString,
	SerializablePrimitive
} from "@workspace/models"
import {
	FC,
	FocusEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState
} from "react"

export type SchedulingParameterItemProps = {
	binanceSymbols: DflowBinanceSymbolInfo[] | undefined
	kind: string
	label: string
	defaultValue?: SerializablePrimitive
	value: SerializablePrimitive | undefined
	setParam: (
		key: IdentifierString,
		value: SerializablePrimitive | undefined
	) => void
}

export const SchedulingParameterItem: FC<SchedulingParameterItemProps> = ({
	binanceSymbols,
	kind,
	defaultValue,
	label,
	value = "",
	setParam
}) => {
	const [hasError, setHasError] = useState(false)

	const onBlur = useCallback<
		FocusEventHandler<
			HTMLInputElement & { value: SchedulingParameterItemProps["value"] }
		>
	>(
		(event) => {
			const value = event.target.value
			if (typeof value !== "string") return

			// Empty `value` resets parameter.
			if (value === "") {
				setParam(label, undefined)
				return
			}

			if (kind === BooleanParameter.kind) {
				try {
					const maybeBool = JSON.parse(value)
					if (typeof maybeBool === "boolean") {
						setHasError(false)
						setParam(label, maybeBool)
					} else {
						setHasError(true)
					}
				} catch (error) {
					if (error instanceof SyntaxError) {
						setHasError(true)
						return
					}
					throw error
				}
			}

			if (kind === NumberParameter.kind) {
				const maybeNum = Number(value)
				if (isFiniteNumber(maybeNum)) {
					setHasError(false)
					setParam(label, maybeNum)
				} else {
					setHasError(true)
				}
			}

			if (kind === StringParameter.kind) {
				if (isFiniteString(value)) {
					setHasError(false)
					setParam(label, value)
				} else {
					setHasError(true)
				}
			}

			if (kind === IntervalParameter.kind) {
				if (isDflowBinanceKlineInterval(value)) {
					setHasError(false)
					setParam(label, value)
				} else {
					setHasError(true)
				}
			}

			if (kind === SymbolParameter.kind) {
				const maybeSymbol = value
					.split(dflowBinanceSymbolSeparator)
					.join("")
				const isSymbol = binanceSymbols?.some(
					({ symbol }) => symbol === maybeSymbol
				)
				if (isSymbol) {
					setHasError(false)
					setParam(label, maybeSymbol)
				} else {
					setHasError(true)
				}
			}
		},
		[binanceSymbols, kind, label, setParam]
	)

	// Validate incoming value to show UI feedback.
	useEffect(() => {
		if (value === "") return
		if (kind === BooleanParameter.kind && typeof value === "boolean") return

		if (kind === NumberParameter.kind && isFiniteNumber(Number(value)))
			return

		if (
			kind === IntervalParameter.kind &&
			isDflowBinanceKlineInterval(value)
		)
			return

		if (kind === SymbolParameter.kind) {
			if (!binanceSymbols) return
			const isSymbol = binanceSymbols.some(
				({ baseAsset, quoteAsset }) => baseAsset + quoteAsset === value
			)
			if (isSymbol) return
		}

		setHasError(true)
	}, [kind, value, binanceSymbols])

	const formattedValue = useMemo(() => {
		if (SymbolParameter.kind === kind) {
			if (!binanceSymbols) return ""
			const symbolInfo = binanceSymbols.find(
				({ baseAsset, quoteAsset }) => baseAsset + quoteAsset === value
			)
			if (symbolInfo)
				return `${symbolInfo.baseAsset}${dflowBinanceSymbolSeparator}${symbolInfo.quoteAsset}`
		}
		return String(value ?? "")
	}, [binanceSymbols, kind, value])

	return (
		<InputField
			color={hasError ? "danger" : undefined}
			onBlur={onBlur}
			placeholder={String(defaultValue ?? "")}
			label={label}
			defaultValue={formattedValue}
		/>
	)
}
