import { InputField } from '_/components/library'
import { BooleanParameter, dflowBinanceKlineIntervals, DflowBinanceSymbolInfo, dflowBinanceSymbolSeparator, IntervalParameter, isDflowBinanceKlineInterval, NumberParameter, parsePercentage, PercentageParameter, StringParameter, SymbolParameter } from '@workspace/dflow'
import { IdentifierString, isFiniteNumber, isFiniteString, SerializablePrimitive } from '@workspace/models'
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from 'react'

export type SchedulingParameterItemProps = {
	binanceSymbols: DflowBinanceSymbolInfo[] | undefined
	kind: string
	label: string
	defaultParamValue?: SerializablePrimitive
	paramValue: SerializablePrimitive | undefined
	setParam: (
		key: IdentifierString,
		value: SerializablePrimitive | undefined
	) => void
}

export function SchedulingParameterItem({
	binanceSymbols, kind, defaultParamValue, label, paramValue, setParam
}: SchedulingParameterItemProps) {
	const [hasError, setHasError] = useState(false)

	const onChange = useCallback<ChangeEventHandler<HTMLInputElement & { value: SchedulingParameterItemProps['paramValue'] }>>(
		(event) => {
			const value = event.target.value
			if (typeof value !== 'string') return

			// Empty `value` resets parameter.
			if (value === '') {
				setParam(label, undefined)
				return
			}

			if (kind === BooleanParameter.kind) {
				try {
					const maybeBool = JSON.parse(value)
					if (typeof maybeBool === 'boolean') {
						setHasError(false)
						setParam(label, maybeBool)
					} else {
						setHasError(true)
					}
				} catch {
					setHasError(true)
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

			if (kind === PercentageParameter.kind) {
				const maybeNum = parsePercentage(value)
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
				const maybeSymbol = value.split(dflowBinanceSymbolSeparator).join('').toUpperCase()
				const isSymbol = binanceSymbols?.some(({ symbol }) => symbol === maybeSymbol)
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
		if (paramValue === undefined) return
		if (kind === BooleanParameter.kind) {
			if (typeof paramValue === 'boolean') return
		}
		if (kind === IntervalParameter.kind) {
			if (isDflowBinanceKlineInterval(paramValue)) return
		}
		if (kind === NumberParameter.kind) {
			if (isFiniteNumber(paramValue)) return
		}
		if (kind === PercentageParameter.kind) {
			if (typeof paramValue === 'string' && parsePercentage(paramValue) !== undefined) return
		}
		if (kind === SymbolParameter.kind) {
			if (binanceSymbols?.some(({ baseAsset, quoteAsset }) => baseAsset + quoteAsset === paramValue)) return
		}
		setHasError(true)
	}, [kind, paramValue, binanceSymbols])

	const placeholder = useMemo(() => {
		if (PercentageParameter.kind === kind) {
			if (typeof defaultParamValue === 'number') return `${defaultParamValue * 100}%`
		}
		if (SymbolParameter.kind === kind) {
			if (!binanceSymbols) return ''
			const symbolInfo = binanceSymbols.find(
				({ baseAsset, quoteAsset }) => baseAsset + quoteAsset === defaultParamValue
			)
			if (symbolInfo) return `${symbolInfo.baseAsset}${dflowBinanceSymbolSeparator}${symbolInfo.quoteAsset}`
		}
		return String(defaultParamValue ?? '')
	}, [binanceSymbols, kind, defaultParamValue])

	const value = useMemo(() => {
		if (SymbolParameter.kind === kind) {
			if (!binanceSymbols) return ''
			const symbolInfo = binanceSymbols.find(
				({ baseAsset, quoteAsset }) => baseAsset + quoteAsset === paramValue
			)
			if (symbolInfo) return `${symbolInfo.baseAsset}${dflowBinanceSymbolSeparator}${symbolInfo.quoteAsset}`
		}
		return String(paramValue ?? '')
	}, [binanceSymbols, kind, paramValue])

	return (
		<>
			<InputField
				color={hasError ? 'danger' : undefined}
				label={label}
				list={label}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
			/>
			{kind === IntervalParameter.kind && (
				<datalist id={label}>
					{dflowBinanceKlineIntervals.map((value) => (
						<option key={value} value={value} />
					))}
				</datalist>
			)}
			{kind === SymbolParameter.kind && (
				<datalist id={label}>
					{binanceSymbols?.map(({ baseAsset, quoteAsset }) => (
						<option key={baseAsset + quoteAsset} value={`${baseAsset}${dflowBinanceSymbolSeparator}${quoteAsset}`} />
					))}
				</datalist>
			)}
		</>
	)
}
