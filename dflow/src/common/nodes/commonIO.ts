import { Dflow, DflowDataType } from "dflow"

const { input, output } = Dflow

export const inputDefaultParameter = (dataType: DflowDataType) =>
	input(dataType, { name: "default" })

export const inputArray = input("array", { name: "array" })

export const inputExecute = input("boolean", {
	name: "execute",
	optional: true
})

export const inputClose = input("array", { name: "close" })
export const outputClose = output("array", { name: "close" })

export const inputHigh = input("array", { name: "high" })
export const outputHigh = output("array", { name: "high" })

export const inputKey = input("string", { name: "key" })

export const inputLow = input("array", { name: "low" })
export const outputLow = output("array", { name: "low" })

export const outputLastValue = output("number", { name: "last" })

export const inputOpen = input("array", { name: "open" })
export const outputOpen = output("array", { name: "open" })

export const inputPeriod = input("number", { name: "period" })

export const inputValues = input("array", { name: "values" })
export const outputValues = output("array", { name: "values" })

export const inputValues1 = input("array", { name: "values1" })
export const inputValues2 = input("array", { name: "values2" })

export const outputVolume = input("array", { name: "volume" })
