import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { userContext } from "../store/userContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppLayout() {
  const { user } = useContext(userContext);


  // useEffect(() => {
  //   if (user.role) toast.success(`Welcome ${user.name}`);
  //   let time: NodeJS.Timeout;
  //   if (user.role === "admin") {
  //     time = setTimeout(() => navigate("/app/admin/dailydetails"), 5000);
  //   } else if (user.role === "receptionist") {
  //     time = setTimeout(() => navigate("/app/receptionist/dashboard"), 5000);
  //   } else if (user.role === "paramedic") {
  //     time = setTimeout(() => navigate("/app/paramedic/dashboard"), 5000);
  //   } else if (user.role === "doctor") {
  //     time = setTimeout(() => navigate("/app/doctor/dashboard"), 5000);
  //   } else {
  //     time = setTimeout(() => navigate("/auth"), 5000);
  //   }
  //   return () => clearTimeout(time);
  // }, [user.role, navigate, user.name]);

  return (
    <>
      {user.role && (
        <div className="flex">
          <ToastContainer stacked autoClose={2000} />
          <Sidebar />
          <div className="fixed right-0 top-0 w-[85%]">
            <Topbar />
            <div className="overflow-y-auto h-[calc(100vh-4rem)]">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppLayout;
