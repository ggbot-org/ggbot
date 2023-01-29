import { FC } from "react";
import { Table, Tbody, Th, Thead, Tr, Td } from "../src";

export const SimpleTable: FC = () => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>field 1</Th>
          <Th>field 2</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>cell 11</Td>
          <Td>cell 12</Td>
        </Tr>
        <Tr>
          <Td>cell 21</Td>
          <Td>cell 22</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
