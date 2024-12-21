declare const deployStages: readonly ['main', 'next', 'local']
export type DeployStage = (typeof deployStages)[number]
