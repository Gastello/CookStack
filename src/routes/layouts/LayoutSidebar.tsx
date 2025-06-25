import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

export default function LayoutSidebar() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="h-full grow">
        <Outlet />
      </div>
    </div>
  );
}
