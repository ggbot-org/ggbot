import { StrategyFlowGraph } from '@workspace/models'

import { DflowParameter } from './parameters'

export declare function extractCommonParametersFromFlow(graph: StrategyFlowGraph): Promise<DflowParameter[]>
