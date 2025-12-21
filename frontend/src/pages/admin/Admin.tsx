import { Users, Activity, Stethoscope, ClipboardList } from "lucide-react"
import { StatsCard } from "@/components/dashboard/Stats-card"
import { VisitsChart } from "@/components/dashboard/charts/Visits-chart"
import { StaffChart } from "@/components/dashboard/charts/Staff-chart"
import { VisitorsPieChart } from "@/components/dashboard/charts/Visits-pie"
import Access from "../common/access";
import { useEffect, useState } from "react";
import { api } from "@/lib/utils";


export default function Dashboard() {
   const [data, setData] = useState([
      { name: "total", value: 0 },
      { name: "average", value: 0 },
      { name: "doctors", value: 0 },
      { name: "appointments", value: 0 },
    ]);
  
    useEffect(() => {
      try {
        api.get("/admin/getAnalysis").then((res) => {
          if (res.data.success) {
            setData(res.data.data);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }, []);
  return (
  <Access text={["admin"]}>
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Patients" value={data[0].value} icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Daily Average" value={data[1].value} icon={<Activity className="h-5 w-5" />} />
        <StatsCard title="Active Doctors" value={data[2].value} icon={<Stethoscope className="h-5 w-5" />} />
        <StatsCard title="Appointments" value={data[3].value} icon={<ClipboardList className="h-5 w-5" />} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-4 lg:col-span-7">
          <VisitsChart />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-3">
            <VisitorsPieChart />
        </div>
        <div className="md:col-span-4">
          <StaffChart />
        </div>
      </div>
    </div>
  </Access>
  )
}