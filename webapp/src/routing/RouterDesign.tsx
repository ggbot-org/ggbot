import { I18nProvider } from "_/contexts/I18n"
import { ToastProvider } from "_/contexts/Toast"
import { ShowcasePage } from "_/pages/design/Showcase"
import { mount } from "_/react/mount"

mount(
	<I18nProvider>
		<ToastProvider>
			<ShowcasePage />
		</ToastProvider>
	</I18nProvider>
)
