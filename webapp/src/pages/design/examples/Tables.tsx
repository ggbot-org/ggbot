import { Table } from "_/components/library"

function list(length: number) {
	return Array.from({ length }).map((_, index) => `${index}`)
}

export function SimpleTable() {
	const numColumns = 10
	const numRows = 4
	return (
		<Table>
			<thead>
				<tr>
					{list(numColumns).map((key) => (<th key={key}>{`field ${key}`}</th>))}
				</tr>
			</thead>
			<tbody>
				{list(numRows).map((row) => (
					<tr key={row}>
						{list(numColumns).map((col) => (<td key={col}>{`cell ${row}-${col}`}</td>))}
					</tr>
				))}
			</tbody>
		</Table>
	)
}
