import { I18nProvider } from "_/contexts/I18n"
import { ShowcasePage } from "_/pages/design/Showcase"
import { mount } from "_/react/mount"

mount(
	<I18nProvider>
		<ShowcasePage />
	</I18nProvider>
)
