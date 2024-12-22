/** A node is a comment if its text contains spaces, newlines. */
export declare function isInfoNode(text: string): boolean

/** A node which text is valid JSON is used to store data. */
export declare function isJsonNode(text: string): boolean

export declare function isPercentageNode(text: string): boolean

export declare function parsePercentage(text: string): number | undefined
