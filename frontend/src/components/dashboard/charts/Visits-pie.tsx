import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";

const COLORS = ["#2563eb", "#22c55e", "#f59e0b"];

export function VisitorsPieChart() {
  const [data, setData] = useState([
    { name: "Students", value: 0 },
    { name: "Faculty", value: 0 },
    { name: "Others", value: 0 },
  ]);

  useEffect(() => {
    try {
      api.get("/admin/pieChartData").then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Visited Persons in Dispensary</h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm text-gray-600">
              {entry.name} ({entry.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
