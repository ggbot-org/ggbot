export class ErrorMissingDflowExecutionReport extends Error {
  constructor() {
    super("Missing Dflow executionReport");
  }
}

export class ErrorUknownDflowNodes extends Error {
  constructor(nodes: { id: string; text: string }[]) {
    super(JSON.stringify(nodes));
  }
}
