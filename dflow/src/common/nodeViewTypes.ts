export const nodeViewTypes = ["json", "info", "perc"] as const;

export type NodeViewType = (typeof nodeViewTypes)[number];
