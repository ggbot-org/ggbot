export class ErrorUknownDflowNodes extends Error {
  constructor(nodes: string[]) {
    super(JSON.stringify(nodes));
  }
}
