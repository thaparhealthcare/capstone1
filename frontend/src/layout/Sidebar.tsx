import {
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlineInventory } from "react-icons/md";

import { userContext } from "@/store/userContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/utils";

const links = [
  {
    role: "receptionist",
    links: [
      {
        name: "Dashboard",
        href: "/app/receptionist/dashboard",
        logo: <LayoutDashboard className="mr-3 h-5 w-5" />,
      },
      {
        name: "OPD",
        href: "/app/receptionist/opd",
        logo: <Stethoscope className="mr-3 h-5 w-5" />,
      },
      {
        name: "OPD Log",
        href: "/app/receptionist/opdLog",
        logo: <ClipboardList className="mr-3 h-5 w-5" />,
      },
      // {
      //   name: "Medical Waste",
      //   href: "/app/receptionist/dashboard",
      //   logo: <Trash2 className="mr-3 h-5 w-5" />,
      // },
      // {
      //   name: "Rest",
      //   href: "/app/receptionist/dashboard",
      //   logo: <Coffee className="mr-3 h-5 w-5" />,
      // },
      // {
      //   name: "Training",
      //   href: "/app/receptionist/dashboard",
      //   logo: <GraduationCap className="mr-3 h-5 w-5" />,
      // },
    ],
  },
  {
    role: "paramedic",
    links: [
      {
        name: "Dashboard",
        href: "/app/paramedic/dashboard",
        logo: <LayoutDashboard className="mr-3 h-5 w-5" />,
      },
      {
        name: "Inventory",
        href: "/app/paramedic/inventory",
        logo: <MdOutlineInventory className="mr-3 h-5 w-5" />,
      },
      {
        name: "Patient Queue",
        href: "/app/paramedic/opdLog",
        logo: <ClipboardList className="mr-3 h-5 w-5" />,
      },
      {
        name: "Add Medicine",
        href: "/app/paramedic/add-medicine",
        logo: <ClipboardList className="mr-3 h-5 w-5" />,
      },
      // {
      //   name: "Training",
      //   href: "/app/paramedic/dashboard",
      //   logo: <GraduationCap className="mr-3 h-5 w-5" />,
      // },
    ],
  },
  {
    role: "doctor",
    links: [
      {
        name: "Dashboard",
        href: "/app/doctor/dashboard",
        logo: <LayoutDashboard className="mr-3 h-5 w-5" />,
      },
      {
        name: "Patient Queue",
        href: "/app/doctor/patientqueue",
        logo: <ClipboardList className="mr-3 h-5 w-5" />,
      },
      {
        name: "Prescribe",
        href: "/app/doctor/prescribe",
        logo: <LuNotebookPen className="mr-3 h-5 w-5" />,
      },
      {
        name: "OPD Schedule",
        href: "/app/doctor/availability",
        logo: <ClipboardList className="mr-3 h-5 w-5" />,
      },
      {
        name: "View Schedule",
        href: "/app/doctor/schedule/view",
        logo: <ClipboardList className="mr-3 h-5 w-5" />,
      },
      {
        name: "View Appointments",
        href: "/app/doctor/appointments",
        logo: <ClipboardList className="mr-3 h-5 w-5" />,
      },
    ],
  },
  {
    role: "admin",
    links: [
      {
        name: "Dashboard",
        href: "/app/admin/dashboard",
        logo: <LayoutDashboard className="mr-3 h-5 w-5" />,
      },
      {
        name: "DailyDetails",
        href: "/app/admin/dailydetails",
        logo: <LayoutDashboard className="mr-3 h-5 w-5" />,
      },
      {
        name: "AddAccount",
        href: "/app/admin/addaccount",
        logo: <GraduationCap className="mr-3 h-5 w-5" />,
      },
    ],
  },
];

export default function Sidebar() {
  const { user } = useContext(userContext);
  const links1 = links.find((link) => link.role === user.role)?.links;
  const navigate = useNavigate();
  async function logout() {
    const response = await api.get(`/user/logout`);
    console.log(response.status);
    navigate("/auth");
  }
  return (
    <div className="fixed left-0 top-0 h-full w-[15%] bg-darkBlue text-white">
      <div className="flex gap-2 items-center text-xl font-semibold p-4">
        <div className="size-12 rounded-full overflow-hidden">
          <img src="/tiet_logo.jpg" className="w-full h-full object-cover" />
        </div>
        <h1>TIET MediHub</h1>
      </div>

      <div className="px-4">
        <nav className="space-y-2">
          {links1?.map((link, i) => (
            <Link
              to={link.href}
              key={i}
              className="flex items-center px-4 py-3 text-gray-100 hover:bg-gray-700 rounded-lg group transition-colors duration-200"
            >
              {link.logo}
              <p className="group-hover:ml-1.5 transition-all duration-300">
                {link.name}
              </p>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={() => logout()}
          className="flex w-full items-center px-4 py-3 text-gray-100 group hover:bg-gray-700 rounded-lg"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <p className="group-hover:ml-1.5 transition-all duration-300">
            Logout
          </p>
        </button>
      </div>
    </div>
  );
}
