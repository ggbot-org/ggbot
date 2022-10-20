export class ErrorUknownDflowNodes extends Error {
  constructor(nodes: { id: string; text: string }[]) {
    super(JSON.stringify(nodes));
  }
}
