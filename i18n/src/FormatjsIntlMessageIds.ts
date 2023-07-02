export const FormatjsIntlMessageIdsFilename = "FormatjsIntlMessageIds.d.ts";

export const FormatjsIntlMessageIdsContent = (
  translationKeys: string[]
) => `// prettier-ignore
export declare type FormatjsIntlMessageId =
  | ${translationKeys.map((key) => `"${key}"`).join("\n  | ")};

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: FormatjsIntlMessageId;
    }
  }
}
`;
