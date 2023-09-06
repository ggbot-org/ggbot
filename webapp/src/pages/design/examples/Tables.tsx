import { Table } from "_/components/library"
import { FC } from "react"

export const SimpleTable: FC = () => (
	<Table>
		<thead>
			<tr>
				<th>field 1</th>

				<th>field 2</th>
			</tr>
		</thead>

		<tbody>
			<tr>
				<td>cell 11</td>

				<td>cell 12</td>
			</tr>

			<tr>
				<td>cell 21</td>

				<td>cell 22</td>
			</tr>
		</tbody>
	</Table>
)
