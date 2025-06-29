import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { useUserStore } from "../../App";

export default function LayoutSidebar() {
  const { user } = useUserStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="h-full grow">
        <Outlet />
      </div>
    </div>
  );
}
