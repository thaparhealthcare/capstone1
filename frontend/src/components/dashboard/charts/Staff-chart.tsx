import { api } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function StaffChart() {
  const [data, setData] = useState([
    { category: "Doctor", count: 0 },
    { category: "Receptionist", count: 0 },
    { category: "Paramedic", count: 0 },
    { category: "Other Staff", count: 0 },
  ]);

  useEffect(() => {
    try {
      api.get("/admin/getCountOfEmployees").then((res) => {
        if (res.data.success) {
          setData(res.data.roles);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Number of Employees by Category
        </h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
