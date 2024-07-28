import { classnames } from "_/classnames"
import { Column, Columns, Logo, Section, Title } from "_/components/library"
import { PageContainer } from "_/components/PageContainer"

import { ButtonColors, LoadingButtons } from "./examples/Buttons"
import { SimpleForm } from "./examples/Forms"
import { Icons } from "./examples/Icons"
import { InputFields } from "./examples/InputFields"
import { Palette } from "./examples/Palette"
import { SimpleTable } from "./examples/Tables"
import { TagsExample } from "./examples/Tags"
import { TimeIntervalSelectors } from "./examples/TimeIntervalSelectors"
import { ToastExample } from "./examples/Toast"
import { Typography } from "./examples/Typography"

export function ShowcasePage() {
	return (
		<PageContainer>
			<Section>
				<Title>Logo</Title>

				<div className={classnames("is-flex")}>
					<Logo size={200} />

					<Logo animated size={200} />
				</div>
			</Section>

			<Section>
				<Title>Typography</Title>

				<Typography />
			</Section>

			<Section>
				<Title>Palette</Title>

				<Palette />
			</Section>

			<Section>
				<Title>Inputs</Title>

				<Columns>
					<Column bulma="is-half">
						<InputFields />
					</Column>
				</Columns>
			</Section>

			<Section>
				<Title>Forms</Title>

				<Columns>
					<Column bulma="is-half">
						<SimpleForm />
					</Column>
				</Columns>
			</Section>

			<Section>
				<Title>Buttons</Title>

				<ButtonColors />

				<LoadingButtons />
			</Section>

			<Section>
				<Title>Time interval selectors</Title>

				<TimeIntervalSelectors />
			</Section>

			<Section>
				<Title>Icons</Title>

				<Icons />
			</Section>

			<Section>
				<Title>Tags</Title>

				<TagsExample />
			</Section>

			<Section>
				<Title>Tables</Title>

				<SimpleTable />
			</Section>

			<Section>
				<Title>Toast</Title>

				<ToastExample />
			</Section>
		</PageContainer>
	)
}
