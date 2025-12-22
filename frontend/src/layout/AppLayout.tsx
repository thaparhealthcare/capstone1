import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { userContext } from "../store/userContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useEffect } from "react";
import { api } from "../lib/utils";
import { useNavigate } from "react-router-dom";

function AppLayout() {
  const { user ,dispatch} = useContext(userContext);
  const navigate = useNavigate();


  useEffect(() => {
  
      const fetchUser = async () => {
        try {
          const response = await api.post(`/user/checkLogin`, {
            withCredentials: true,
          });
          const data = response.data;
          dispatch(data);
        } catch (err) {
          console.log("Error fetching user data:", err);
          navigate("/");
        }
      };
      fetchUser();
    }, [dispatch]);

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
