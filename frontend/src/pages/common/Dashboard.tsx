import { ReactNode } from "react";
import ProfileForm from "./profile-form"; // assuming ProfileForm remains in its own file
import Access from "./access";

// DashboardLayout component defined inside the same file
function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" flex h-screen bg-gray-100 ">
      <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
    </div>
  );
}

// DashboardPage component that uses the DashboardLayout
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Access text={["admin","doctor","receptionist","paramedic"]}>
      <div className="p-5">
        <h1 className="text-4xl ml-8 font-semibold font-medium text-gray-800 mt-0 mb-1">
          Dashboard
        </h1>
        <ProfileForm />
      </div>
      </Access>
    </DashboardLayout>
  );
}

// import DashboardLayout from "./dashboard-layout"
// import ProfileForm from "./profile-form"

// export default function DashboardPage() {
//   return (
//     <DashboardLayout>
//       <div className="p-6">
//         <h1 className="text-3xl font-medium text-gray-800 mb-6">Dashboard</h1>
//         <ProfileForm />
//       </div>
//     </DashboardLayout>
//   )
// }
