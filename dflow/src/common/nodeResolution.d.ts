import { NodeViewType } from './nodeViewTypes'

/** Resolve node view type by its text. */
export declare function nodeTextToViewType(text: string): NodeViewType | undefined

/** Resolve common nodes kind. If no match is found, return the input text. */
export declare function nodeTextToDflowKind(text: string): string
