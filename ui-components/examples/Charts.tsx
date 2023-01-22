import type { FC } from "react";
import { LineChart, Line, Tooltip } from "recharts";

const data1 = [
  { name: "2022-01-01", v: 10 },
  { name: "2022-01-02", v: 11 },
  { name: "2022-01-03", v: 14 },
  { name: "2022-01-04", v: 18 },
  { name: "2022-01-05", v: 17 },
  { name: "2022-01-06", v: 15 },
  { name: "2022-01-07", v: 12 },
];

export const Charts: FC = () => {
  return (
    <div>
      <LineChart width={400} height={200} data={data1}>
        <Line type="monotone" dataKey="v" stroke="#8884d8" />
        <Tooltip />
      </LineChart>
    </div>
  );
};
