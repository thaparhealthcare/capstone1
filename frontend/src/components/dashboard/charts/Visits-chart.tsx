import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";

export function VisitsChart() {
  const [data, setData] = useState([
    { month: "Jan", visits: 0 },
    { month: "Feb", visits: 0 },
    { month: "Mar", visits: 0 },
    { month: "Apr", visits: 0 },
    { month: "May", visits: 0 },
    { month: "Jun", visits: 0 },
    { month: "Jul", visits: 0 },
    { month: "Aug", visits: 0 },
    { month: "Sep", visits: 0 },
    { month: "Oct", visits: 0 },
    { month: "Nov", visits: 0 },
    { month: "Dec", visits: 0 },
  ]);

  useEffect(() => {
    try {
      api.get("/admin/getCountOfPatientsOverMonths").then((res) => {
        if (res.data.success) {
          const result = res.data.data;
          console.log("Fetched Visits Data:", result);
          result.forEach((item: number, index: number) => {
              data[index].visits = item;
              setData(data);
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Students Visited Over Months</h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
