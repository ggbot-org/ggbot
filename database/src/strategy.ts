// TODO remove this file

// export const upsertStrategyFrequency = async ({
// 	frequency,
// 	...strategyKey
// }: StrategyKey & { frequency: Frequency }): Promise<void> => {
// 	const strategy = await readStrategyOrThrow(strategyKey)
// 	if (frequenciesAreEqual(frequency, strategy.frequency)) return
// 	await WRITE(pathname.strategy(strategyKey), { ...strategy, frequency })
// }
