import { I18nMessageMarkupTag } from '_/i18n/messages'
import { ReactNode } from 'react'

type FormattedMessageValues = Record<I18nMessageMarkupTag, (chunks: ReactNode[]) => JSX.Element>

// TODO update examples here, react-intl is not used anymore

/**
 * Common JSX values to define markup used by <FormattedMessage> component.
 *
 * @example
 *
 * ```tsx
 * import {formattedMessageMarkup} from "_/i18n/formattedMessageMarkup"
 * import { FormattedMessage } from "react-intl"
 *
 * export function MyComponent ({ name }: { name: string }) {
 *   return (
 *    <FormattedMessage
 *      id="MyComponent.message"
 *      values={{
 *        name,
 *        ...formattedMessageMarkup
 *      }}
 *    />
 *  )
 * }
 * ```
 */
export const formattedMessageMarkup: Omit<FormattedMessageValues, 'a'> = {
	b: (chunks) => <b>{chunks}</b>,
	em: (chuncks) => <em>{chuncks}</em>,
	strong: (chunks) => <strong>{chunks}</strong>
}

/**
 * Common JSX values to define markup used by <FormattedMessage> component
 * <strong>plus</strong> a link.
 *
 * @remarks
 * Having a single link is not a limitation, actually is better for UX; a
 * message should have no more than one link to click.
 *
 * @example
 *
 * ```tsx
 * import {formattedMessageMarkupWithLinkTo} from "_/i18n/formattedMessageMarkup"
 * import { FormattedMessage } from "react-intl"
 *
 * export function MyComponent() {
 *   return (
 *     <FormattedMessage
 *       id="MyComponent.message"
 *       values={formattedMessageMarkupWithLinkTo("https://example.com")}
 *     />
 *   )
 * }
 * ```
 */
export function formattedMessageMarkupWithLinkTo(url: string): FormattedMessageValues {
	return {
		a: (content: ReactNode[]) => <a href={url}>{content}</a>,
		...formattedMessageMarkup
	}
}
