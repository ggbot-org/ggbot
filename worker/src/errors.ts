type NodeError = Error & {
  code?: string;
};

export const isNodeError = (arg: unknown): arg is NodeError => {
  if (!(arg instanceof Error)) return false;
  const { code } = arg as Partial<NodeError>;
  return typeof code === "string";
};
