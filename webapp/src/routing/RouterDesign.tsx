import { I18nProvider } from "_/contexts/I18n"
import { IntlProvider } from "_/contexts/Intl"
import { ToastProvider } from "_/contexts/Toast"
import { ShowcasePage } from "_/pages/design/Showcase"
import { mount } from "_/react/mount"

mount(
	<I18nProvider>
		<IntlProvider>
			<ToastProvider>
				<ShowcasePage />
			</ToastProvider>
		</IntlProvider>
	</I18nProvider>
)
