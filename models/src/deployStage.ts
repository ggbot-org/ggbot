import { isLiteralType } from "minimal-type-guard-helpers"

const deployStages = ["main", "next", "local"] as const
export type DeployStage = typeof deployStages[number]
export const isDeployStage = isLiteralType<DeployStage>(deployStages)
