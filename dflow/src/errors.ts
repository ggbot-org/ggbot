export class ErrorUknownDflowNodes extends Error {
	static message = "Unknown dflow nodes"
	readonly nodes: Array<{ id: string; text: string }>
	constructor(nodes: ErrorUknownDflowNodes["nodes"]) {
		super(ErrorUknownDflowNodes.message)
		this.nodes = nodes
	}
}
