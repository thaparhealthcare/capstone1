import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import AddAccount from "./pages/admin/AddAccount.tsx";
import Admin from "./pages/admin/Admin.tsx";
import { Auth } from "./pages/common/Auth";
import Dashboard from "./pages/common/Dashboard.tsx";
import DoctorAppointments from "./pages/doctor/DoctorAppointments.tsx";
import DoctorAvailability from "./pages/doctor/DoctorAvailability.tsx";
import DoctorCalendar from "./pages/doctor/DoctorCalender.tsx";
import Prescribe from "./pages/doctor/Prescribe";
import { AddMedicine } from "./pages/paramedics/AddMedicine.tsx";
import DispatchMedicine from "./pages/paramedics/DispatchMedicine.tsx";
import Inventory from "./pages/paramedics/Inventory.tsx";
import MedicineInfo from "./pages/paramedics/MedicineInfo.tsx";
import OpdLog from "./pages/paramedics/opdLog.tsx";
import Opd from "./pages/receptionist/Opd.tsx";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Auth />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/app",
      element: <AppLayout />,
      children: [
        {
          path: "admin",
          children: [
            { path: "inventory", element: <Inventory /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "dailydetails", element: <Admin /> },
            { path: "addaccount", element: <AddAccount /> },
          ],
        },
        {
          path: "receptionist",
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "opd", element: <Opd /> },
            { path: "opdLog", element: <OpdLog status="false" /> },
          ],
        },
        {
          path: "doctor",
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "patientqueue", element: <OpdLog status="false" /> },
            { path: "prescribe", element: <Prescribe /> },
            {
              path: "availability",
              element: <DoctorAvailability />,
            },
            {
              path: "schedule/view",
              element: <DoctorCalendar />,
            },
            {
              path: "appointments",
              element: <DoctorAppointments />,
            },
          ],
        },
        {
          path: "paramedic",
          children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "opdLog", element: <OpdLog status="true" /> },
            { path: "dispatch-medicine", element: <DispatchMedicine /> },
            { path: "inventory", element: <Inventory /> },
            { path: "medicine-info", element: <MedicineInfo /> },
            { path: "add-medicine", element: <AddMedicine /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
