import { ReactNode } from 'react'

type FormattedMessageValues = Record<string, (chunks: ReactNode[]) => JSX.Element>

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
export const formattedMessageMarkup: FormattedMessageValues = {
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
		a: (text) => <a href={url}>{text}</a>,
		...formattedMessageMarkup
	}
}
