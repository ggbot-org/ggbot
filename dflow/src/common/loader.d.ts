import { StrategyFlowGraph } from '@workspace/models'
import { Dflow } from 'dflow'

/**
 * A Dflow instance that can load a StrategyFlowGraph.
 *
 * @example
 *
 * ```ts
 * import { StrategyFlowGraph } from "@workspace/models"
 * import { DflowLoader, load } from "../path/to/loader.js"
 *
 * class MyDflowHost extends Dflow implements DflowLoader {
 *   load(graph: StrategyFlowGraph): void {
 *     load({ dflow: this, graph })
 *   }
 * }
 * ```
 */
export interface DflowLoader extends Dflow {
	load(graph: StrategyFlowGraph): void;
}

/**
 * Parse and load a Dflow graph.
 *
 * @remarks
 * Unknown nodes and broken connections are ignored.
 */
export declare function load({ dflow, graph }: {
	dflow: DflowLoader;
	graph: StrategyFlowGraph;
}): void
